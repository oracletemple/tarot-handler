// B_telegram.js — v1.5.25
// Updated imports to use API‑based modules with word limits
const axios = require("axios");
const { getSession, startSession, getCard, isSessionComplete } = require("./G_tarot-session");
const { getCardMeaning } = require("./G_tarot-engine");
const { renderCardButtons } = require("./G_button-render");
const { getSpiritGuide } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");
const { getTarotSummary } = require("./G_tarot-summary");
const { renderPremiumButtonsInline, premiumHandlers, removeClickedButton } = require("./G_premium-buttons");
const { startFlow, incrementDraw, markStep, markPremiumClick, debugFlow } = require("./G_flow-monitor");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const BASE_URL = process.env.BASE_URL;
const DEFAULT_MS = 15000;
const BUFFER_MS = 2000;
const loadHistory = {};

async function answerCallbackQuery(id, text = "", alert = false) {
  try {
    await axios.post(`${API_URL}/answerCallbackQuery`, { callback_query_id: id, text, show_alert: alert });
  } catch (err) {
    console.error("[answerCallbackQuery error]", err.response ? err.response.data : err.message);
  }
}

function escapeMarkdown(text) {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

async function editReplyMarkup(chatId, messageId, reply_markup) {
  try {
    await axios.post(`${API_URL}/editMessageReplyMarkup`, { chat_id: chatId, message_id: messageId, reply_markup });
  } catch (err) {
    console.error("[editReplyMarkup error]", err.response ? err.response.data : err.message);
  }
}

async function sendMessage(chatId, text, reply_markup = null) {
  const payload = { chat_id: chatId, text: escapeMarkdown(text), parse_mode: "MarkdownV2" };
  if (reply_markup) payload.reply_markup = reply_markup;
  try {
    await axios.post(`${API_URL}/sendMessage`, payload);
  } catch (err) {
    console.error("[sendMessage error]", err.response ? err.response.data : err.message);
  }
}

async function sendPhoto(chatId, photoUrl, caption, reply_markup = null) {
  try {
    const payload = { chat_id: chatId, photo: photoUrl, caption: escapeMarkdown(caption) };
    if (reply_markup) payload.reply_markup = reply_markup;
    await axios.post(`${API_URL}/sendPhoto`, payload);
  } catch (err) {
    console.error("[sendPhoto error]", err.response ? err.response.data : err.message);
    await sendMessage(chatId, caption);
  }
}

function renderBasicButtons() {
  return {
    inline_keyboard: [
      [{ text: "🧚 Spirit Guide", callback_data: "basic_spirit" }],
      [{ text: "🎨 Lucky Hints",   callback_data: "basic_lucky" }],
      [{ text: "🌕 Moon Advice",   callback_data: "basic_moon" }]
    ]
  };
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

  if (premiumHandlers[data] && session.amount < 30) {
    await answerCallbackQuery(cb.id, `Unlock by paying ${30 - session.amount} USDT`, true);
    await sendMessage(userId, "Please complete payment to unlock this module:", {
      inline_keyboard: [[{ text: `Pay ${30 - session.amount} USDT`, url: "https://divinepay.onrender.com/" }]]
    });
    return;
  }

  if (data.startsWith("basic_")) {
    // ... existing basic handling ...
  }

  if (data.startsWith("card_")) {
    // ... existing card handling, then after completion:
    await sendMessage(userId, "✨ Explore your guidance modules:", { inline_keyboard: renderPremiumButtonsInline() });
    return;
  }

  if (premiumHandlers[data] && session.amount >= 30) {
    // ... existing premium handling ...
  }
}

module.exports = { handleTelegramUpdate };
