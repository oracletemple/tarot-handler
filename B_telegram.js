// ⚠️ 本次生成的 B_telegram.js 文件需覆盖上传到以下位置：
// - tarot-handler/B_telegram.js

// B_telegram.js - v1.5.20
const axios = require("axios");
const { getSession, startSession, getCard, isSessionComplete } = require("./G_tarot-session");
const { getCardMeaning } = require("./G_tarot-engine");
const { renderCardButtons } = require("./G_button-render");
const { getSpiritGuide } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");
const { renderPremiumButtonsInline, premiumHandlers, removeClickedButton } = require("./G_premium-buttons");
const { startFlow, incrementDraw, markStep, markPremiumClick, debugFlow } = require("./G_flow-monitor");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const DEFAULT_MS = 15000;
const BUFFER_MS = 2000;
// 记录各模块加载时长的历史数组
const loadHistory = {};

async function answerCallbackQuery(id, text = '', alert = false) {
  try {
    await axios.post(`${API_URL}/answerCallbackQuery`, { callback_query_id: id, text, show_alert: alert });
  } catch {} // ignore
}

function escapeMarkdown(text) {
  return text.replace(/[_*\[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

async function editReplyMarkup(chatId, messageId, reply_markup) {
  try {
    await axios.post(`${API_URL}/editMessageReplyMarkup`, { chat_id: chatId, message_id: messageId, reply_markup });
  } catch {} // ignore
}

async function sendMessage(chatId, text, reply_markup = null) {
  const payload = { chat_id: chatId, text: escapeMarkdown(text), parse_mode: "MarkdownV2" };
  if (reply_markup) payload.reply_markup = reply_markup;
  try {
    await axios.post(`${API_URL}/sendMessage`, payload);
  } catch {} // ignore
}

// 基础版模块按钮
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

  if (msg) {
    const { chat: { id: chatId }, text } = msg;
    if ((text === "/test123" || text === "/test12") && chatId == process.env.RECEIVER_ID) {
      startFlow(chatId);
      const session = startSession(chatId, 12);
      await sendMessage(chatId, "🃏 Please draw your cards:", renderCardButtons(session));
      return;
    }
    if (text === "/test30" && chatId == process.env.RECEIVER_ID) {
      startFlow(chatId);
      const session = startSession(chatId, 30);
      await sendMessage(chatId, "🃏 Please draw your cards:", renderCardButtons(session));
      return;
    }
    if (text === "/debugflow" && chatId == process.env.RECEIVER_ID) {
      const status = debugFlow(chatId);
      await sendMessage(chatId, status);
      return;
    }
  }

  if (!cb) return;
  const userId = cb.from.id;
  const data   = cb.data;
  const msgId  = cb.message.message_id;
  const session= getSession(userId);

  // 🔒 基础版访问高级模块 → 补差价
  if (premiumHandlers[data] && session.amount < 30) {
    await answerCallbackQuery(cb.id, `Unlock by paying ${30 - session.amount} USDT`, true);
    await sendMessage(userId, 'Please complete payment to unlock this module:', { inline_keyboard:[[
      { text: `Pay ${30 - session.amount} USDT`, url: 'https://divinepay.onrender.com/' }
    ]]});
    return;
  }

  // 🧚 基础版模块点击
  if (data.startsWith('basic_')) {
    session._basicHandled = session._basicHandled || new Set();
    if (session._basicHandled.has(data)) return;
    session._basicHandled.add(data);

    // 动态倒计时
    const history   = loadHistory[data] || [];
    const avgMs     = history.length ? history.reduce((a,b) => a + b, 0) / history.length : DEFAULT_MS;
    const countdown = Math.ceil((avgMs + BUFFER_MS) / 1000);

    await answerCallbackQuery(cb.id, '', false);
    await editReplyMarkup(userId, msgId, { inline_keyboard:[[{ text: `Fetching insight... ${countdown}s`, callback_data: data }]] });

    let rem = countdown;
    const iv = setInterval(async () => {
      rem--;
      if (rem >= 0) {
        await editReplyMarkup(userId, msgId, { inline_keyboard:[[{ text: `Fetching insight... ${rem}s`, callback_data: data }]] });
      }
      if (rem < 0) clearInterval(iv);
    }, 1000);

    const start = Date.now();
    let handler;
    if (data === 'basic_spirit') handler = () => getSpiritGuide(userId);
    if (data === 'basic_lucky')  handler = () => getLuckyHints(userId);
    if (data === 'basic_moon')   handler = () => getMoonAdvice(userId);

    try {
      const result = await handler();
      const duration = Date.now() - start;
      loadHistory[data] = loadHistory[data] || [];
      loadHistory[data].push(duration);

      clearInterval(iv);
      const remainingKb = removeClickedButton(cb.message.reply_markup, data);
      await editReplyMarkup(userId, msgId, remainingKb);
      await sendMessage(userId, result);
      markStep(userId, data);
    } catch {
      clearInterval(iv);
      await sendMessage(userId, `⚠️ Failed to load: ${data}`);
    }
    return;
  }

  // ♠️ 抽牌逻辑
  if (data.startsWith('card_')) {
    const idx = parseInt(data.split('_')[1], 10);
    try {
      const card    = getCard(userId, idx);
      const meaning = getCardMeaning(card, idx);
      await sendMessage(userId, meaning);
      incrementDraw(userId);

      if (!isSessionComplete(userId)) {
        await editReplyMarkup(userId, msgId, renderCardButtons(session));
      } else {
        await editReplyMarkup(userId, msgId, { inline_keyboard: [] });
        const basicKb   = renderBasicButtons().inline_keyboard;
        const premiumKb = renderPremiumButtonsInline().inline_keyboard;
        // 分隔线行
        const separator = [[{ text: '── Advanced Exclusive Insights ──', callback_data: 'noop' }]];
        const combined  = basicKb.concat(separator, premiumKb);

        await sendMessage(userId, '✨ Explore your guidance modules:', { inline_keyboard: combined });
        markStep(userId, 'bothButtonsShown');
      }
    } catch (err) {
      await sendMessage(userId, `⚠️ ${err.message}`);
    }
    return;
  }

  // 🌟 高级版模块点击
  if (premiumHandlers[data] && session.amount >= 30) {
    session._premiumHandled = session._premiumHandled || new Set();
    if (session._premiumHandled.has(data)) return;
    session._premiumHandled.add(data);

    const history   = loadHistory[data] || [];
    const avgMs     = history.length ? history.reduce((a,b) => a + b, 0) / history.length : DEFAULT_MS;
    const countdown = Math.ceil((avgMs + BUFFER_MS) / 1000);
    await answerCallbackQuery(cb.id, '', false);
    await editReplyMarkup(userId, msgId, { inline_keyboard:[[{ text: `Fetching insight... ${countdown}s`, callback_data: data }]] });

    let rem2 = countdown;
    const iv2 = setInterval(async () => {
      rem2--;
      if (rem2 >= 0) await editReplyMarkup(userId, msgId, { inline_keyboard:[[{ text: `Fetching insight... ${rem2}s`, callback_data: data }]] });
      if (rem2 < 0) clearInterval(iv2);
    }, 1000);

    const start2 = Date.now();
    try {
      const res = await premiumHandlers[data](userId);
      const dur = Date.now() - start2;
      loadHistory[data] = loadHistory[data] || [];
      loadHistory[data].push(dur);

      clearInterval(iv2);
      const rb = removeClickedButton(cb.message.reply_markup, data);
      await editReplyMarkup(userId, msgId, rb);
      await sendMessage(userId, res);
      markPremiumClick(userId, data);
    } catch {
      clearInterval(iv2);
      await sendMessage(userId, `⚠️ Failed to load: ${data}`);
    }
    return;
  }
}

module.exports = { handleTelegramUpdate };
