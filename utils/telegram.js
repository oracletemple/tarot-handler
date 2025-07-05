// v1.0.11
const axios = require('axios');
const BOT_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text) {
  return axios.post(`${BASE_URL}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
  });
}

async function sendTarotButtons(chatId) {
  return axios.post(`${BASE_URL}/sendMessage`, {
    chat_id: chatId,
    text: '👇 Tap a card to reveal your Tarot Reading:',
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
}

async function simulateButtonClick(chatId, callbackData) {
  try {
    const url = `${process.env.WEBHOOK_URL}/webhook`;
    const res = await axios.post(url, {
      callback_query: {
        message: { chat: { id: chatId } },
        from: { id: chatId },
        data: callbackData,
      },
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
