// utils/telegram.js - v1.0.7
const axios = require('axios');
const { getCard, startSession, isSessionComplete, getFullReading } = require('./tarot-session');

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

// ✅ 发送三张塔罗牌按钮
async function sendTarotButtons(chatId) {
  try {
    // 启动新的解读 session
    startSession(chatId);

    const keyboard = {
      inline_keyboard: [[
        { text: 'Draw First Card', callback_data: 'draw_1' },
        { text: 'Draw Second Card', callback_data: 'draw_2' },
        { text: 'Draw Third Card', callback_data: 'draw_3' }
      ]]
    };

    await axios.post(`${apiUrl}/sendMessage`, {
      chat_id: chatId,
      text: '🔮 Please focus your energy and draw 3 cards...
👇 Tap the buttons to reveal your Tarot Reading:',
      reply_markup: keyboard,
    });
  } catch (err) {
    console.error('[ERROR] Failed to send tarot buttons:', err.message);
  }
}

// ✅ 处理按钮互动
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
  const responseText = `🃏 *${label}* – *${card.name}* ${card.reversed ? '(Reversed)' : ''}
_${card.meaning}_`;

  // 发送抽牌结果
  await axios.post(`${apiUrl}/sendMessage`, {
    chat_id: chatId,
    text: responseText,
    parse_mode: 'Markdown',
  });

  // 清除按钮 loading 状态
  await axios.post(`${apiUrl}/answerCallbackQuery`, {
    callback_query_id: callbackQuery.id,
  });

  // 若三张牌都已抽完，发送完整解读
  if (isSessionComplete(userId)) {
    const fullReading = getFullReading(userId);
    await sendMessage(chatId, fullReading);
  }
}

module.exports = {
  sendMessage,
  sendTarotButtons,
  handleDrawCard,
};
