// utils/telegram.js - v1.0.6
const axios = require('axios');
const { getCard, startSession } = require('./tarot-session');

const token = process.env.BOT_TOKEN;
const apiUrl = `https://api.telegram.org/bot${token}`;

// ✅ 发送文字消息（通用）
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

// ✅ 发送按钮
async function sendTarotButtons(chatId) {
  try {
    startSession(chatId); // 初始化新占卜 session

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

// ✅ 处理按钮点击交互
async function handleDrawCard(callbackQuery) {
  const { message, data, from } = callbackQuery;
  const chatId = message.chat.id;
  const userId = from.id;

  const index = { draw_1: 0, draw_2: 1, draw_3: 2 }[data];
  if (index === undefined) return;

  const card = getCard(userId, index);
  if (!card) return;

  const labels = ['Past', 'Present', 'Future'];
  const text = `🃏 *${labels[index]}* – *${card.name}* ${card.orientation === 'Reversed' ? '(Reversed)' : ''}\n_${card.meaning}_`;

  await axios.post(`${apiUrl}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
  });

  // 清除按钮 loading 状态
  await axios.post(`${apiUrl}/answerCallbackQuery`, {
    callback_query_id: callbackQuery.id,
  });
}

module.exports = {
  sendMessage,
  sendTarotButtons,
  handleDrawCard,
};
