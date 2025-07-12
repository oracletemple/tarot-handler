// B_telegram.js — v1.5.29
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

const ADDRESS_RE = /^T[1-9A-Za-z]{33}$/;

async function answerCallbackQuery(id, text = '', alert = false) {
  try {
    await axios.post(`${API_URL}/answerCallbackQuery`, { callback_query_id: id, text, show_alert: alert });
  } catch (err) {
    console.error('[answerCallbackQuery error]', err.response?.data || err.message);
  }
}

function escapeMarkdown(text) {
  return text.replace(/([_*!\[\]()~`>#+\-=|{}\.\!])/g, '\\$1');
}

async function editReplyMarkup(chatId, messageId, reply_markup) {
  try {
    await axios.post(`${API_URL}/editMessageReplyMarkup`, { chat_id: chatId, message_id: messageId, reply_markup });
  } catch (err) {
    console.error('[editReplyMarkup error]', err.response?.data || err.message);
  }
}

async function sendMessage(chatId, text, reply_markup = null) {
  const payload = { chat_id: chatId, text: escapeMarkdown(text), parse_mode: 'MarkdownV2' };
  if (reply_markup) payload.reply_markup = reply_markup;
  try {
    await axios.post(`${API_URL}/sendMessage`, payload);
  } catch (err) {
    console.error('[sendMessage error]', err.response?.data || err.message);
  }
}

async function sendPhoto(chatId, photoUrl, caption, reply_markup = null) {
  try {
    const payload = { chat_id: chatId, photo: photoUrl, caption: escapeMarkdown(caption) };
    if (reply_markup) payload.reply_markup = reply_markup;
    await axios.post(`${API_URL}/sendPhoto`, payload);
  } catch (err) {
    console.error('[sendPhoto error]', err.response?.data || err.message);
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
  if (msg && msg.text) {
    const t = msg.text.trim();
    // 注册钱包地址
    if (ADDRESS_RE.test(t)) {
      register(t, msg.chat.id);
      await sendMessage(msg.chat.id,
        `✅ Registered TRON address:\n${t}\n\nOnce payment arrives, I'll send your draw buttons.`
      );
      // 处理付款先行的 pending
      const pendings = drainPending(t);
      for (const { amount, txid } of pendings) {
        await sendMessage(msg.chat.id,
          `🙏 Detected past payment of ${amount} USDT (tx: ${txid}). Please draw your cards:`
        );
        await sendMessage(msg.chat.id, '🃏 Please draw your cards:', renderCardButtons(getSession(msg.chat.id)));
      }
      return;
    }
    // 测试命令
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

  // 后续 callback_query 处理保持不变…
  // … (card_, basic_, premium_ 逻辑) …
}

module.exports = { handleTelegramUpdate };
