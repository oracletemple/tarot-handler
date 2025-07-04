// v1.1.0
const axios = require('axios');
const { getCard } = require('./tarot-session');

const token = process.env.BOT_TOKEN;
const apiUrl = `https://api.telegram.org/bot${token}`;

async function sendMessage(chatId, text, options = {}) {
  try {
    await axios.post(`${apiUrl}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      ...options,
    });
  } catch (error) {
    console.error('[ERROR] Failed to send message:', error.message);
  }
}

async function sendTarotButtons(chatId) {
  try {
    const keyboard = {
      inline_keyboard: [[
        { text: 'Draw First Card', callback_data: 'draw_1' },
        { text: 'Draw Second Card', callback_data: 'draw_2' },
        { text: 'Draw Third Card', callback_data: 'draw_3' },
      ]]
    };

    await axios.post(`${apiUrl}/sendMessage`, {
      chat_id: chatId,
      text: '🔮 Please focus your energy and draw 3 cards...\n\n👇 Tap the buttons to reveal your Tarot Reading:',
      reply_markup: keyboard,
    });
  } catch (err) {
    console.error('[ERROR] Failed to send tarot buttons:', err.message);
  }
}

async function handleDrawCard(callbackQuery) {
  const { message, data, from } = callbackQuery;
  const chatId = message.chat.id;
  const userId = from.id;

  const cardIndex = {
    draw_1: 0,
    draw_2: 1,
    draw_3: 2,
  }[data];

  if (cardIndex === undefined) return;

  const card = getCard(userId, cardIndex);
  if (!card) return;

  const label = ['Past', 'Present', 'Future'][cardIndex];
  const text = `🃏 *${label}* – *${card.name}* ${card.reversed ? '(Reversed)' : ''}\n_${card.meaning}_`;

  await sendMessage(chatId, text);
  await axios.post(`${apiUrl}/answerCallbackQuery`, {
    callback_query_id: callbackQuery.id,
  });
}

module.exports = {
  sendMessage,
  sendTarotButtons,
  handleDrawCard,
};
