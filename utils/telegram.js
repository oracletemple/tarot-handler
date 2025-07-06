// utils/telegram.js  // v1.2.3

const axios = require('axios');
const { getCard, isSessionComplete, clearSession } = require('./tarot-session');
const { formatCardMessage } = require('./tarot-engine');

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(userId, text, options = {}) {
  return axios.post(`${API_URL}/sendMessage`, {
    chat_id: userId,
    text,
    parse_mode: 'HTML',
    ...options,
  });
}

async function sendButtonMessage(userId, text) {
  const buttons = [
    [{ text: '🃏 Card 1', callback_data: 'card_0' }],
    [{ text: '🃏 Card 2', callback_data: 'card_1' }],
    [{ text: '🃏 Card 3', callback_data: 'card_2' }]
  ];

  return axios.post(`${API_URL}/sendMessage`, {
    chat_id: userId,
    text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: buttons
    }
  });
}

async function handleCallbackQuery(userId, data) {
  const index = parseInt(data.split('_')[1]);
  const card = getCard(userId, index);
  if (!card) {
    await sendMessage(userId, '⚠️ Session not found. Please try again later.');
    return;
  }

  console.log(`🎴 Card ${index} drawn by ${userId}`);
  const message = formatCardMessage(card, index);
  await sendMessage(userId, message);

  if (isSessionComplete(userId)) {
    console.log(`✅ Session complete for ${userId}`);
    await clearSession(userId);
  }
}

module.exports = {
  sendMessage,
  sendButtonMessage,
  handleCallbackQuery
};
