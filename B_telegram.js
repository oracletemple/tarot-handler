// B_telegram.js — v1.5.28
// Core Telegram update handler with dynamic pricing and word-limited API modules
require("dotenv").config();
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

// Dynamic pricing and thresholds from environment
const PRICE_BASIC = parseFloat(process.env.PRICE_BASIC);
const PRICE_PREMIUM = parseFloat(process.env.PRICE_PREMIUM);
const UPGRADE_PRICE = parseFloat(process.env.UPGRADE_PRICE);
const THRESHOLD_PREMIUM = parseFloat(process.env.AMOUNT_THRESHOLD_PREMIUM);

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
  return text.replace(/([_*!\[\]()~`>#+\-=|{}\.\!])/g, "\\$1");
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
      const session = startSession(chatId, PRICE_BASIC);
      await sendMessage(chatId, "🃏 Please draw your cards:", renderCardButtons(session));
      return;
    }
    if (text === "/test30" && chatId == process.env.RECEIVER_ID) {
      startFlow(chatId);
      const session = startSession(chatId, PRICE_PREMIUM);
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
  const userId  = cb.from.id;
  const data    = cb.data;
  const msgId   = cb.message.message_id;
  const session = getSession(userId);

  // 🔒 Premium access check using dynamic threshold
  if (premiumHandlers[data] && session.amount < THRESHOLD_PREMIUM) {
    const text = `🔓 Upgrade needed: pay ${UPGRADE_PRICE} USDT to access this module.`;
    await answerCallbackQuery(cb.id, text, true);
    await sendMessage(userId, text, {
      inline_keyboard: [[{ text: `Pay ${UPGRADE_PRICE} USDT`, url: "https://divinepay.onrender.com" }]]
    });
    return;
  }

  // ... rest of basic, card, and premium handlers unchanged ...
}

module.exports = { handleTelegramUpdate };
