// v1.2.3
const axios = require('axios');
const { getCard, isSessionComplete, endSession } = require('./tarot-session');
const { formatCardMessage } = require('./tarot-engine');

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendButtonMessage(chatId, message) {
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: message,
    reply_markup: {
      inline_keyboard: [
        [{ text: '🃏 Card 1', callback_data: 'card_0' }],
        [{ text: '🃏 Card 2', callback_data: 'card_1' }],
        [{ text: '🃏 Card 3', callback_data: 'card_2' }]
      ]
    }
  });
}

async function handleCallbackQuery(callbackQuery) {
  const userId = callbackQuery.from.id;
  const data = callbackQuery.data;

  if (!data.startsWith('card_')) return;

  const cardIndex = parseInt(data.split('_')[1]);
  const card = getCard(userId, cardIndex);

  if (!card) {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: userId,
      text: '⚠️ Session not found or invalid card. Please try again later.'
    });
    return;
  }

  const text = formatCardMessage(card, cardIndex);

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: userId,
    text,
    parse_mode: 'HTML'
  });

  if (isSessionComplete(userId)) {
    await endSession(userId);
  }
}

module.exports = {
  sendButtonMessage,
  handleCallbackQuery
};
