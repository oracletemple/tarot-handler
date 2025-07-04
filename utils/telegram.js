// v1.1.2
const axios = require('axios');
const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

function sendMessage(userId, text) {
  return axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: userId,
    text,
    parse_mode: 'Markdown',
  });
}

function sendTarotButtons(userId) {
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🃏 Card 1', callback_data: 'card_1' },
        { text: '🃏 Card 2', callback_data: 'card_2' },
        { text: '🃏 Card 3', callback_data: 'card_3' },
      ],
    ],
  };

  return axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: userId,
    text: '✨ Tap a card to reveal your message:',
    reply_markup: keyboard,
  });
}

function simulateButtonClick(userId, buttonId) {
  const url = 'https://tarot-handler.onrender.com/simulate-click';
  return axios.post(url, { userId, buttonId });
}

function handleDrawCard(userId, buttonId) {
  const card = {
    card_1: '🌟 Card 1: A new journey begins. Trust your path.',
    card_2: '🔥 Card 2: Action is needed. Don’t hesitate.',
    card_3: '💧 Card 3: Embrace emotions. Healing is near.',
  }[buttonId] || 'Unknown card.';

  return sendMessage(userId, card);
}

module.exports = {
  sendMessage,
  sendTarotButtons,
  simulateButtonClick,
  handleDrawCard,
};
