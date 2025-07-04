// utils/telegram.js · v1.1.2
const axios = require('axios');
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text) {
  try {
    const res = await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    });
    return res.data;
  } catch (err) {
    console.error('[ERROR] Failed to send message:', err.message);
    throw err;
  }
}

async function sendTarotButtons(chatId) {
  try {
    const res = await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text: '👇 Tap to reveal your Tarot Reading:',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🃏 Card 1', callback_data: 'card_1' },
            { text: '🃏 Card 2', callback_data: 'card_2' },
            { text: '🃏 Card 3', callback_data: 'card_3' },
          ],
        ],
      },
    });
    return res.data;
  } catch (err) {
    console.error('[ERROR] Failed to send tarot buttons:', err.message);
    throw err;
  }
}

async function simulateButtonClick(userId, cardId) {
  try {
    const res = await axios.post(`https://tarot-handler.onrender.com/simulate-click`, {
      userId,
      cardId,
    });
    console.log('[INFO] Simulate click success:', res.data);
  } catch (err) {
    console.error('[ERROR] Simulate click failed:', err.message);
  }
}

module.exports = {
  sendMessage,
  sendTarotButtons,
  simulateButtonClick,
};
