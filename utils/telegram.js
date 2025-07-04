// v1.1.2
const axios = require('axios');

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
    console.error('[ERROR] Failed to send message:', err.response?.data || err.message);
    throw err;
  }
}

async function sendTarotButtons(chatId) {
  try {
    const buttons = {
      inline_keyboard: [
        [
          { text: '🃏 Draw Card 1', callback_data: 'card_1' },
          { text: '🃏 Draw Card 2', callback_data: 'card_2' },
          { text: '🃏 Draw Card 3', callback_data: 'card_3' },
        ],
      ],
    };

    const res = await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text: '🧘 Focus your energy and choose a card:',
      reply_markup: buttons,
    });

    return res.data;
  } catch (err) {
    console.error('[ERROR] Failed to send tarot buttons:', err.response?.data || err.message);
    throw err;
  }
}

async function simulateButtonClick(chatId, card) {
  try {
    const res = await axios.post(`https://tarot-handler.onrender.com/webhook`, {
      message: {
        chat: { id: chatId },
      },
      data: card,
    });
    console.log('[INFO] Simulate click success:', res.data?.ok ? 'OK' : res.data);
  } catch (err) {
    console.error('[ERROR] Simulate button click failed:', err.response?.data || err.message);
  }
}

module.exports = {
  sendMessage,
  sendTarotButtons,
  simulateButtonClick,
};
