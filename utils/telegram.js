// v1.1.0
const axios = require('axios');
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

function sendMessage(chatId, text, extra = {}) {
  return axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
    ...extra,
  });
}

function sendTarotButtons(chatId) {
  return axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: '✨ Draw your 3 cards by tapping below:',
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Card 1 🃏', callback_data: 'card_1' },
          { text: 'Card 2 🃏', callback_data: 'card_2' },
          { text: 'Card 3 🃏', callback_data: 'card_3' }
        ]
      ]
    }
  });
}

function simulateButtonClick(userId, cardId) {
  if (!WEBHOOK_URL) {
    console.error('[ERROR] Missing WEBHOOK_URL in .env');
    return;
  }

  return axios.post(`${WEBHOOK_URL}/webhook`, {
    message: { chat: { id: userId } },
    data: cardId
  }).then(res => {
    console.log('[INFO] Simulate click success:', res.data);
  }).catch(err => {
    console.error('[ERROR] Simulate click failed:', err.message);
  });
}

module.exports = {
  sendMessage,
  sendTarotButtons,
  simulateButtonClick,
};
