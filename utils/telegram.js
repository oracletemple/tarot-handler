// utils/telegram.js
// v1.1.0

const axios = require('axios');
const { getCard, isSessionComplete, startSession } = require('./tarot-session');

const token = process.env.BOT_TOKEN;
const apiUrl = `https://api.telegram.org/bot${token}`;

// ✅ 发送消息
async function sendMessage(chatId, text, options = {}) {
  try {
    await axios.post(`${apiUrl}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      ...options,
    });
  } catch (err) {
    console.error('[ERROR] Failed to send message:', err.message);
  }
}

// ✅ 发送塔罗按钮
async function sendTarotButtons(chatId) {
  const keyboard = {
    inline_keyboard: [[
      { text: 'Draw First Card', callback_data: 'card_1' },
      { text: 'Draw Second Card', callback_data: 'card_2' },
      { text: 'Draw Third Card', callback_data: 'card_3' },
    ]]
  };

  try {
    await axios.post(`${apiUrl}/sendMessage`, {
      chat_id: chatId,
      text: '🔮 Please focus your energy and draw 3 cards...\n\n👇 Tap the buttons to reveal your Tarot Reading:',
      reply_markup: keyboard,
    });
  } catch (err) {
    console.error('[ERROR] Failed to send tarot buttons:', err.message);
  }
}

// ✅ 处理互动按钮
async function handleDrawCard(callbackQuery) {
  const { message, data, from } = callbackQuery;
  const chatId = message.chat.id;
  const userId = from.id;

  const indexMap = {
    card_1: 0,
    card_2: 1,
    card_3: 2,
  };

  const index = indexMap[data];
  if (index === undefined) return;

  const card = getCard(userId, index);
  if (!card) return;

  const label = ['Past', 'Present', 'Future'][index];
  const cardText = `🃏 *${label}* – *${card.name}* (${card.orientation})\n_${card.meaning}_`;

  await sendMessage(chatId, cardText);

  await axios.post(`${apiUrl}/answerCallbackQuery`, {
    callback_query_id: callbackQuery.id,
  });

  if (isSessionComplete(userId)) {
    await sendMessage(chatId, `✨ Your full reading is complete. Trust the journey ahead.`);
  }
}

// ✅ 模拟点击（用于测试自动点击按钮）
async function simulateButtonClick(chatId, cardKey) {
  try {
    const fakeCallback = {
      id: 'simulate_' + Date.now(),
      from: { id: chatId },
      message: { chat: { id: chatId } },
      data: cardKey,
    };
    await handleDrawCard(fakeCallback);
    console.log('[INFO] Simulate click success:', { ok: true, message: 'Simulated card draw sent.' });
  } catch (err) {
    console.error('[ERROR] Simulate button click failed:', err.message);
  }
}

module.exports = {
  sendMessage,
  sendTarotButtons,
  handleDrawCard,
  simulateButtonClick,
};
