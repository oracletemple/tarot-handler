// B_telegram.js — v1.5.29
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
const BASE_URL = process.env.BASE_URL;
const DEFAULT_MS = 15000;
const BUFFER_MS = 2000;

async function answerCallbackQuery(id, text = "", alert = false) {
  try {
    await axios.post(`${API_URL}/answerCallbackQuery`, { callback_query_id: id, text, show_alert: alert });
  } catch (err) {
    console.error("[answerCallbackQuery error]", err.response?.data || err.message);
  }
}

function escapeMarkdown(text) {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

async function editReplyMarkup(chatId, messageId, reply_markup) {
  try {
    await axios.post(`${API_URL}/editMessageReplyMarkup`, { chat_id: chatId, message_id: messageId, reply_markup });
  } catch (err) {
    console.error("[editReplyMarkup error]", err.response?.data || err.message);
  }
}

function splitText(text, maxLen = 2000) {
  const parts = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + maxLen, text.length);
    if (end < text.length) {
      const idx = text.lastIndexOf(' ', end);
      if (idx > start) end = idx;
    }
    parts.push(text.slice(start, end));
    start = end;
  }
  return parts;
}

async function sendMessage(chatId, text, reply_markup = null) {
  const chunks = splitText(text, 2000);
  for (let i = 0; i < chunks.length; i++) {
    const payload = { chat_id: chatId, text: escapeMarkdown(chunks[i]), parse_mode: "MarkdownV2" };
    if (i === 0 && reply_markup) payload.reply_markup = reply_markup;
    try {
      await axios.post(`${API_URL}/sendMessage`, payload);
    } catch (err) {
      console.error("[sendMessage error]", err.response?.data || err.message);
    }
  }
}

async function sendPhoto(chatId, photoUrl, caption) {
  try {
    await axios.post(`${API_URL}/sendPhoto`, {
      chat_id: chatId,
      photo: photoUrl,
      caption: escapeMarkdown(caption),
      parse_mode: "MarkdownV2"
    });
  } catch (err) {
    console.error("[sendPhoto error]", err.response?.data || err.message);
    // fallback to text
    await sendMessage(chatId, caption);
  }
}

function renderBasicButtons() {
  return { inline_keyboard: [
    [{ text: "🧚 Spirit Guide", callback_data: "basic_spirit" }],
    [{ text: "🎨 Lucky Hints",   callback_data: "basic_lucky" }],
    [{ text: "🌕 Moon Advice",   callback_data: "basic_moon" }]
  ]};
}

async function handleTelegramUpdate(update) {
  const { message: msg, callback_query: cb } = update;
  if (msg) {
    const { id: chatId } = msg.chat;
    const text = msg.text;
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
  const session = getSession(userId);
  const data = cb.data;
  const msgId = cb.message.message_id;

  // 基础版模块点击逻辑省略…
  if (data.startsWith('basic_')) {
    // …保持不变
    return;
  }

  // 抽牌逻辑省略…
  if (data.startsWith('card_')) {
    // …保持不变
    return;
  }

  // 高级模块点击：带倒计时和隐藏按钮
  if (premiumHandlers[data]) {
    // 防重点
    session._premiumHandled = session._premiumHandled || new Set();
    if (session._premiumHandled.has(data)) return;
    session._premiumHandled.add(data);

    // 计时器
    const history = loadHistory[data] || [];
    const avgMs = history.length ? history.reduce((a,b) => a+b,0)/history.length : DEFAULT_MS;
    const countdown = Math.ceil((avgMs + BUFFER_MS)/1000);

    await answerCallbackQuery(cb.id);
    await editReplyMarkup(userId, msgId, { inline_keyboard: [[{ text: `Fetching insight... ${countdown}s`, callback_data: data }]] });

    let rem = countdown;
    const iv = setInterval(async () => {
      rem--;
      if (rem >= 0) {
        await editReplyMarkup(userId, msgId, { inline_keyboard: [[{ text: `Fetching insight... ${rem}s`, callback_data: data }]] });
      }
      if (rem < 0) clearInterval(iv);
    }, 1000);

    // 执行处理
    const start = Date.now();
    try {
      const res = await premiumHandlers[data](userId);
      const dur = Date.now() - start;
      loadHistory[data] = history.concat(dur);

      clearInterval(iv);
      const rb = removeClickedButton(cb.message.reply_markup, data);
      await editReplyMarkup(userId, msgId, rb);
      await sendMessage(userId, res);
      markPremiumClick(userId, data);
    } catch (err) {
      clearInterval(iv);
      console.error("[premium handling error]", err);
      await sendMessage(userId, `⚠️ Failed to load: ${data}`);
    }
    return;
  }
}

module.exports = { handleTelegramUpdate };
