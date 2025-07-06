// telegram.js - v1.2.2
const axios = require('axios');
const { getCard, isSessionComplete, endSession } = require('./tarot-session');
const { formatCardMessage } = require('./tarot-engine');

const TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

async function sendButtonMessage(userId, text) {
  const keyboard = {
    inline_keyboard: [
      [{ text: '🃏 Card 1', callback_data: 'card_0' }],
      [{ text: '🃏 Card 2', callback_data: 'card_1' }],
      [{ text: '🃏 Card 3', callback_data: 'card_2' }],
    ],
  };

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: userId,
    text,
    reply_markup: keyboard,
    parse_mode: 'HTML',
  });
}

async function handleCallbackQuery(query) {
  const userId = query.from.id;
  const data = query.data;

  const match = data.match(/^card_(\d)$/);
  if (!match) return;

  const index = parseInt(match[1], 10);
  const card = getCard(userId, index);

  if (!card) {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: userId,
      text: '⚠️ Session not found. Please try again later.',
    });
    return;
  }

  const message = formatCardMessage(card);

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: userId,
    text: message,
    parse_mode: 'HTML',
  });

  console.log(`🎴 Card ${index} drawn by ${userId}`);

  if (isSessionComplete(userId)) {
    console.log(`✅ Session complete for ${userId}`);
    await endSession(userId);

    // 删除按钮
    await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
      chat_id: query.message.chat.id,
      message_id: query.message.message_id,
      reply_markup: { inline_keyboard: [] },
    });
  }
}

module.exports = {
  sendButtonMessage,
  handleCallbackQuery,
};
