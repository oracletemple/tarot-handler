// B_telegram.js — v1.5.30
// Core Telegram update handler with wallet registration, pending support, and module interactions
require('dotenv').config();
const axios = require('axios');
const { getSession, startSession, getCard, isSessionComplete } = require('./G_tarot-session');
const { getCardMeaning } = require('./G_tarot-engine');
const { renderCardButtons } = require('./G_button-render');
const { getSpiritGuide } = require('./G_spirit-guide');
const { getLuckyHints } = require('./G_lucky-hints');
const { getMoonAdvice } = require('./G_moon-advice');
const { getTarotSummary } = require('./G_tarot-summary');
const { renderPremiumButtonsInline, premiumHandlers, removeClickedButton } = require('./G_premium-buttons');
const { startFlow, incrementDraw, markStep, markPremiumClick, debugFlow } = require('./G_flow-monitor');
const { register, drainPending } = require('./utils/G_wallet-map');

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const BASE_URL = process.env.BASE_URL;
const DEFAULT_MS = 15000;
const BUFFER_MS = 2000;
const loadHistory = {};

// Regex for pure TRON address
const ADDRESS_RE = /^T[1-9A-Za-z]{33}$/;

function escapeMarkdown(text) {
  return text.replace(/([_*!\[\]()~`>#+\-=|{}\.\!])/g, '\\$1');
}

async function sendMessage(chatId, text, reply_markup = null) {
  const payload = { chat_id: chatId, text: escapeMarkdown(text), parse_mode: 'MarkdownV2' };
  if (reply_markup) payload.reply_markup = reply_markup;
  await axios.post(`${API_URL}/sendMessage`, payload);
}

async function answerCallbackQuery(id, text = '', alert = false) {
  await axios.post(`${API_URL}/answerCallbackQuery`, { callback_query_id: id, text, show_alert: alert });
}

async function editReplyMarkup(chatId, messageId, reply_markup) {
  await axios.post(`${API_URL}/editMessageReplyMarkup`, { chat_id: chatId, message_id: messageId, reply_markup });
}

async function sendPhoto(chatId, photoUrl, caption, reply_markup = null) {
  try {
    const payload = { chat_id: chatId, photo: photoUrl, caption: escapeMarkdown(caption) };
    if (reply_markup) payload.reply_markup = reply_markup;
    await axios.post(`${API_URL}/sendPhoto`, payload);
  } catch {
    await sendMessage(chatId, caption);
  }
}

function renderBasicButtons() {
  return { inline_keyboard: [
    [{ text: '🧚 Spirit Guide', callback_data: 'basic_spirit' }],
    [{ text: '🎨 Lucky Hints',   callback_data: 'basic_lucky' }],
    [{ text: '🌕 Moon Advice',   callback_data: 'basic_moon' }]
  ]};
}

async function handleTelegramUpdate(update) {
  const msg = update.message;
  const cb  = update.callback_query;

  // Message-based logic (registration & test commands)
  if (msg && msg.text) {
    const t = msg.text.trim();
    // 1️⃣ Register TRON address
    if (ADDRESS_RE.test(t)) {
      register(t, msg.chat.id);
      await sendMessage(msg.chat.id,
        `✅ Registered TRON address:\n${t}\n\nOnce payment arrives, I’ll send you the draw buttons automatically.`
      );
      // Drain and handle any pending payments
      const pendings = drainPending(t);
      for (const { amount, txid } of pendings) {
        await sendMessage(msg.chat.id,
          `🙏 Detected past payment of ${amount} USDT (tx: ${txid}). Please draw your cards:`
        );
        await sendMessage(msg.chat.id, '🃏 Please draw your cards:', renderCardButtons(getSession(msg.chat.id)));
      }
      return;
    }
    // 2️⃣ Dev test commands
    const chatId = msg.chat.id;
    if ((t === '/test123' || t === '/test12') && chatId == process.env.RECEIVER_ID) {
      startFlow(chatId);
      const session = startSession(chatId, 12);
      await sendMessage(chatId, '🃏 Please draw your cards:', renderCardButtons(session));
      return;
    }
    if (t === '/test30' && chatId == process.env.RECEIVER_ID) {
      startFlow(chatId);
      const session = startSession(chatId, 30);
      await sendMessage(chatId, '🃏 Please draw your cards:', renderCardButtons(session));
      return;
    }
    if (t === '/debugflow' && chatId == process.env.RECEIVER_ID) {
      const status = debugFlow(chatId);
      await sendMessage(chatId, status);
      return;
    }
  }

  // Callback-based logic
  if (!cb) return;
  const userId = cb.from.id;
  const data   = cb.data;
  const msgId  = cb.message.message_id;
  const session= getSession(userId);

  // 3️⃣ Basic modules
  if (data.startsWith('basic_')) {
    session._basicHandled = session._basicHandled || new Set();
    if (session._basicHandled.has(data)) return;
    session._basicHandled.add(data);
    const history = loadHistory[data] || [];
    const avgMs   = history.length ? history.reduce((a,b) => a+b)/history.length : DEFAULT_MS;
    const cd      = Math.ceil((avgMs + BUFFER_MS)/1000);
    await answerCallbackQuery(cb.id);
    await editReplyMarkup(userId, msgId, { inline_keyboard: [[{ text: `Fetching... ${cd}s`, callback_data: data }]] });
    let rem = cd;
    const iv = setInterval(async ()=>{
      rem--;
      if(rem>=0) await editReplyMarkup(userId, msgId, { inline_keyboard: [[{ text: `Fetching... ${rem}s`, callback_data: data }]] });
      if(rem<0) clearInterval(iv);
    },1000);
    const start = Date.now();
    let handler = {
      basic_spirit: getSpiritGuide,
      basic_lucky:  getLuckyHints,
      basic_moon:   getMoonAdvice
    }[data];
    try {
      const res = await handler(userId);
      clearInterval(iv);
      loadHistory[data] = loadHistory[data]||[];
      loadHistory[data].push(Date.now()-start);
      await editReplyMarkup(userId, msgId, removeClickedButton(cb.message.reply_markup, data));
      await sendMessage(userId, res);
      markStep(userId, data);
    } catch {
      clearInterval(iv);
      await sendMessage(userId, `⚠️ Failed: ${data}`);
    }
    return;
  }

  // 4️⃣ Card drawing logic
  if (data.startsWith('card_')) {
    await answerCallbackQuery(cb.id);
    const idx = parseInt(data.split('_')[1],10);
    try {
      const card    = getCard(userId, idx);
      const meaning = getCardMeaning(card, idx);
      const imgUrl  = `${BASE_URL}/tarot-images/${encodeURIComponent(card.image)}`;
      await sendPhoto(userId, imgUrl, meaning);
      incrementDraw(userId);
      if (!isSessionComplete(userId)) {
        await editReplyMarkup(userId, msgId, renderCardButtons(session));
      } else {
        await editReplyMarkup(userId, msgId, { inline_keyboard: [] });
        const basicKb   = renderBasicButtons().inline_keyboard;
        const premiumKb = renderPremiumButtonsInline().inline_keyboard;
        const sep       = [[{ text:'── Advanced Insights ──', callback_data:'noop' }]];
        await sendMessage(userId,'✨ Explore你的 guidance modules:', { inline_keyboard: basicKb.concat(sep,premiumKb) });
        markStep(userId,'bothButtonsShown');
      }
    } catch (err) {
      await sendMessage(userId, `⚠️ ${err.message}`);
    }
    return;
  }

  // 5️⃣ Premium modules
  if (premiumHandlers[data]) {
    session._premiumHandled = session._premiumHandled||new Set();
    if (session._premiumHandled.has(data)) return;
    session._premiumHandled.add(data);
    const history = loadHistory[data]||[];
    const avgMs   = history.length ? history.reduce((a,b)=>a+b)/history.length : DEFAULT_MS;
    const cd      = Math.ceil((avgMs + BUFFER_MS)/1000);
    await answerCallbackQuery(cb.id);
    await editReplyMarkup(userId, msgId, { inline_keyboard: [[{ text:`Fetching... ${cd}s`, callback_data: data }]] });
    let rem2=cd;
    const iv2 = setInterval(async()=>{
      rem2--;
      if(rem2>=0) await editReplyMarkup(userId, msgId, { inline_keyboard: [[{ text:`Fetching... ${rem2}s`, callback_data: data }]] });
      if(rem2<0) clearInterval(iv2);
    },1000);
    const start2=Date.now();
    try {
      const res = data==='premium_summary'
        ? await premiumHandlers[data](userId, session)
        : await premiumHandlers[data](userId);
      clearInterval(iv2);
      loadHistory[data]=loadHistory[data]||[];
      loadHistory[data].push(Date.now()-start2);
      await editReplyMarkup(userId, msgId, removeClickedButton(cb.message.reply_markup,data));
      await sendMessage(userId,res);
      markPremiumClick(userId,data);
    } catch {
      clearInterval(iv2);
      await sendMessage(userId, `⚠️ Failed: ${data}`);
    }
    return;
  }
}

module.exports = { handleTelegramUpdate };
