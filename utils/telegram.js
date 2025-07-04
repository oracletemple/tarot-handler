// utils/telegram.js (Session-based version)

const axios = require('axios');
const {
  startSession,
  getCard,
  isSessionComplete,
  getFullReading
} = require('./tarot-session');

const token = process.env.BOT_TOKEN;
const apiUrl = `https://api.telegram.org/bot${token}`;

// ✅ 通用发消息函数
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

// ✅ 发送按钮交互消息
async function sendTarotButtons(chatId) {
  try {
    startSession(chatId);

    const keyboard = {
      inline_keyboard: [[
        { text: 'Draw First Card', callback_data: 'draw_0' },
        { text: 'Draw Second Card', callback_data: 'draw_1' },
        { text: 'Draw Third Card', callback_data: 'draw_2' },
      ]],
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

// ✅ 处理按钮回调函数
async function handleDrawCard(callbackQuery) {
  const { message, data, from, id } = callbackQuery;
  const chatId = message.chat.id;
  const userId = from.id;

  const index = parseInt(data.split('_')[1]);
  if (isNaN(index)) return;

  const card = getCard(userId, index);
  if (!card) return;

  const label = ['Past', 'Present', 'Future'][index];

  const text = `🃏 *${label}* – *${card.name}* (${card.orientation})\n_${card.meaning}_`;

  await axios.post(`${apiUrl}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
  });

  await axios.post(`${apiUrl}/answerCallbackQuery`, {
    callback_query_id: id,
  });

  if (isSessionComplete(userId)) {
    const fullText = getFullReading(userId);
    await sendMessage(chatId, fullText);
  }
}

module.exports = {
  sendMessage,
  sendTarotButtons,
  handleDrawCard,
};
