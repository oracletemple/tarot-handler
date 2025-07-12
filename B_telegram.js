// B_telegram.js — v1.5.29
// Core Telegram update handler with wallet registration and pending payment support
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

// Escape MarkdownV2
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

  // Handle pure TRON address registration
  if (msg && msg.text) {
    const t = msg.text.trim();
    if (ADDRESS_RE.test(t)) {
      register(t, msg.chat.id);
      await sendMessage(msg.chat.id,
        `✅ Registered TRON address:\n${t}\n\nOnce payment arrives, I'll send your draw buttons.`
      );
      // Process any pending payments
      const pendings = drainPending(t);
      for (const { amount, txid } of pendings) {
        await sendMessage(msg.chat.id,
          `🙏 Detected past payment of ${amount} USDT (tx: ${txid}). Please draw your cards:`
        );
        await sendMessage(msg.chat.id, '🃏 Please draw your cards:', renderCardButtons(getSession(msg.chat.id)));
      }
      return;
    }
    // Test commands
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

  // Card drawing logic
  if (cb && cb.data.startsWith('card_')) {
    await answerCallbackQuery(cb.id);
    const idx = parseInt(cb.data.split('_')[1], 10);
    const userId = cb.from.id;
    try {
      const card = getCard(userId, idx);
      const meaning = getCardMeaning(card, idx);
      const imageUrl = `${BASE_URL}/tarot-images/${encodeURIComponent(card.image)}`;
      await sendPhoto(userId, imageUrl, meaning);
      incrementDraw(userId);
      if (!isSessionComplete(userId)) {
        await editReplyMarkup(userId, cb.message.message_id, renderCardButtons(getSession(userId)));
      } else {
        await editReplyMarkup(userId, cb.message.message_id, { inline_keyboard: [] });
        const basicKb   = renderBasicButtons().inline_keyboard;
        const premiumKb = renderPremiumButtonsInline().inline_keyboard;
        const separator = [[{ text: '── Advanced Insights ──', callback_data: 'noop' }]];
        await sendMessage(userId, '✨ Explore your guidance modules:', { inline_keyboard: basicKb.concat(separator, premiumKb) });
        markStep(userId, 'bothButtonsShown');
      }
    } catch (err) {
      await sendMessage(cb.from.id, `⚠️ ${err.message}`);
    }
    return;
  }

  // Basic module clicks
  if (cb && cb.data.startsWith('basic_')) {
    // ... existing basic logic ...
    return;
  }

  // Premium module clicks
  if (cb && premiumHandlers[cb.data]) {
    // ... existing premium logic ...
    return;
  }
}

module.exports = { handleTelegramUpdate };
