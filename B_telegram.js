// B_telegram.js — v1.5.31
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
  console.log('🔔 handleTelegramUpdate received:', JSON.stringify(update));
  try {
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
    // ... existing basic logic ...
    return;
  }

  // 4️⃣ Card drawing logic
  if (data.startsWith('card_')) {
    // ... existing card logic ...
    return;
  }

  // 5️⃣ Premium modules
  if (premiumHandlers[data]) {
    await answerCallbackQuery(cb.id);
    // Immediately remove only the clicked button to prevent re-click
    const newKb = removeClickedButton(cb.message.reply_markup, data);
    await editReplyMarkup(userId, msgId, newKb);

    // Show countdown on same message
    const history = loadHistory[data] || [];
    const avgMs   = history.length ? history.reduce((a,b) => a + b)/history.length : DEFAULT_MS;
    const cd      = Math.ceil((avgMs + BUFFER_MS)/1000);
    await editReplyMarkup(userId, msgId, { inline_keyboard: [[{ text: `Fetching... ${cd}s`, callback_data: data }]] });

    let remaining = cd;
    const iv = setInterval(async () => {
      remaining--;
      if (remaining >= 0) {
        await editReplyMarkup(userId, msgId, { inline_keyboard: [[{ text: `Fetching... ${remaining}s`, callback_data: data }]] });
      } else {
        clearInterval(iv);
      }
    }, 1000);

    const start = Date.now();
    try {
      const res = data === 'premium_summary'
        ? await premiumHandlers[data](userId, session)
        : await premiumHandlers[data](userId);
      clearInterval(iv);
      loadHistory[data] = loadHistory[data] || [];
      loadHistory[data].push(Date.now() - start);

      // After countdown, clear markup
      await editReplyMarkup(userId, msgId, { inline_keyboard: [] });
      // Send result
      await sendMessage(userId, res);
      markPremiumClick(userId, data);
    } catch (err) {
      clearInterval(iv);
      console.error('❌ Premium handler error for', data, err);
      await editReplyMarkup(userId, msgId, { inline_keyboard: newKb });
      await sendMessage(userId, `⚠️ Failed: ${data}`);
    }
    return;
  }
    session._premiumHandled.add(data);

    const history = loadHistory[data] || [];
    const avgMs   = history.length ? history.reduce((a,b) => a+b)/history.length : DEFAULT_MS;
    const cd      = Math.ceil((avgMs + BUFFER_MS)/1000);

    // Show loading feedback in a new message
    const loadingMsg = await axios.post(`${API_URL}/sendMessage`, {
      chat_id: userId,
      text: `⏳ Fetching insight... ${cd}s`,
      parse_mode: 'MarkdownV2'
    });
    const loadingId = loadingMsg.data.result.message_id;

    let rem2 = cd;
    const iv2 = setInterval(async () => {
      rem2--;
      if (rem2 >= 0) {
        await editReplyMarkup(userId, loadingId, { inline_keyboard: [[{ text: `⏳ ${rem2}s`, callback_data: 'noop' }]] });
      } else clearInterval(iv2);
    }, 1000);

    const start2 = Date.now();
    try {
      const res = data === 'premium_summary'
        ? await premiumHandlers[data](userId, session)
        : await premiumHandlers[data](userId);
      clearInterval(iv2);
      loadHistory[data] = loadHistory[data] || [];
      loadHistory[data].push(Date.now() - start2);

      // Remove loading indicator
      await axios.post(`${API_URL}/deleteMessage`, { chat_id: userId, message_id: loadingId });

      // Send result
      await sendMessage(userId, res);
      markPremiumClick(userId, data);
    } catch (err) {
      clearInterval(iv2);
      console.error('❌ Premium handler error for', data, err);
      await sendMessage(userId, `⚠️ Failed: ${data}`);
    }
    return;
  }
    session._premiumHandled.add(data);

    // Show loading state
    const history = loadHistory[data] || [];
    const avgMs   = history.length ? history.reduce((a,b) => a+b)/history.length : DEFAULT_MS;
    const cd      = Math.ceil((avgMs + BUFFER_MS)/1000);
    await editReplyMarkup(userId, msgId, { inline_keyboard: [[{ text: `Fetching... ${cd}s`, callback_data: data }]] });

    let rem2 = cd;
    const iv2 = setInterval(async () => {
      rem2--;
      if (rem2 >= 0) {
        await editReplyMarkup(userId, msgId, { inline_keyboard: [[{ text: `Fetching... ${rem2}s`, callback_data: data }]] });
      } else clearInterval(iv2);
    }, 1000);

    const start2 = Date.now();
    try {
      const res = data === 'premium_summary'
        ? await premiumHandlers[data](userId, session)
        : await premiumHandlers[data](userId);
      clearInterval(iv2);
      loadHistory[data] = loadHistory[data] || [];
      loadHistory[data].push(Date.now() - start2);

      // Send result
      await sendMessage(userId, res);
      markPremiumClick(userId, data);
    } catch (err) {
      clearInterval(iv2);
      console.error('❌ Premium handler error for', data, err);
      await sendMessage(userId, `⚠️ Failed: ${data}`);
    }
    return;
  }
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
      console.log('🔍 Handler result for', data, ':', res);
      clearInterval(iv2);
      loadHistory[data]=loadHistory[data]||[];
      loadHistory[data].push(Date.now()-start2);
      await editReplyMarkup(userId, msgId, removeClickedButton(cb.message.reply_markup,data));
      await sendMessage(userId,res);
      markPremiumClick(userId,data);
    } catch (err) {
      clearInterval(iv2);
      console.error('❌ Premium handler error for', data, err);
      await sendMessage(userId, `⚠️ Failed: ${data}`);
    }
    return;
  }
}

  } catch(err) {
    console.error('❌ Error in handleTelegramUpdate:', err);
  }
}

module.exports = { handleTelegramUpdate };
