// telegram.js  // v1.2.1

const axios = require('axios');
const { drawCards, formatCardMessage } = require('./tarot-engine');
const { startSession, getCard, isSessionComplete, endSession } = require('./tarot-session');

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text, options = {}) {
  return axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    ...options,
  });
}

async function sendButtonMessage(chatId, text) {
  const replyMarkup = {
    inline_keyboard: [
      [
        { text: '🃏 Card 1', callback_data: 'card_0' },
        { text: '🃏 Card 2', callback_data: 'card_1' },
        { text: '🃏 Card 3', callback_data: 'card_2' }
      ]
    ]
  };

  return axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    reply_markup: replyMarkup,
  });
}

async function handleCallbackQuery(callbackQuery) {
  const { message, from, data, id } = callbackQuery;
  const userId = from.id;
  const chatId = message.chat.id;
  const messageId = message.message_id;

  if (!data.startsWith('card_')) return;

  const index = parseInt(data.split('_')[1]);
  if (isNaN(index)) return;

  const card = getCard(userId, index);
  if (!card) {
    return answerCallback(id, '⚠️ Session not found. Please try again later.');
  }

  const response = formatCardMessage(card, index);
  await answerCallback(id);
  await sendMessage(chatId, response);

  if (isSessionComplete(userId)) {
    await endSession(userId);
    await removeInlineKeyboard(chatId, messageId);
  }
}

async function answerCallback(callbackId, text = '') {
  return axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
    callback_query_id: callbackId,
    text,
    show_alert: false,
  });
}

async function removeInlineKeyboard(chatId, messageId) {
  return axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: { inline_keyboard: [] },
  });
}

module.exports = {
  sendMessage,
  sendButtonMessage,
  handleCallbackQuery,
};
