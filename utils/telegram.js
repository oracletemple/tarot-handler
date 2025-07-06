// tarot-handler/utils/telegram.js  // v1.2.2

const axios = require('axios');
const { drawCards, formatCardMessage } = require('./tarot-engine');
const {
  startSession,
  getCard,
  isSessionComplete,
  endSession // ✅ 新增导入
} = require('./tarot-session');

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text, options = {}) {
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    ...options,
  });
}

async function sendButtons(chatId) {
  const buttons = [
    [{ text: '🃏 Card 1', callback_data: 'card_0' }],
    [{ text: '🃏 Card 2', callback_data: 'card_1' }],
    [{ text: '🃏 Card 3', callback_data: 'card_2' }],
  ];

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: '✨ Please choose your card one by one:',
    reply_markup: { inline_keyboard: buttons },
  });
}

async function handlePayment(userId, amount) {
  console.log(`💸 Payment received: ${amount} USDT from ${userId}`);
  await startSession(userId);
  await sendButtons(userId);
}

async function handleCallbackQuery(callback) {
  const userId = callback.from.id;
  const data = callback.data;

  if (!data.startsWith('card_')) return;

  const cardIndex = parseInt(data.split('_')[1]);
  const card = getCard(userId, cardIndex);

  if (!card) {
    console.log(`⚠️ Session not found for ${userId}`);
    await sendMessage(userId, `⚠️ Session not found. Please try again later.`);
    return;
  }

  console.log(`🎴 Card ${cardIndex} drawn by ${userId}`);
  await sendMessage(userId, formatCardMessage(card, cardIndex));

  if (isSessionComplete(userId)) {
    console.log(`✅ Session complete for ${userId}`);
    await endSession(userId); // ✅ 修复崩溃：正确调用 session 清理
  }
}

module.exports = {
  handlePayment,
  handleCallbackQuery,
};
