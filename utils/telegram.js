// ✅ 修复说明：
// 1. 修复 drawTarotCard 未导入的问题；
// 2. 修复已抽完牌还能继续抽的问题；
// 3. 增加自动隐藏按钮逻辑
//
// ⚠️ 本文件需同步上传到两个项目：
// - tarot-handler/utils/telegram.js
// - usdt-listener/utils/telegram.js
// 📌 原因：telegram.js 是共享交互模块，两个服务必须保持一致

const axios = require('axios');
const { startSession, getCard, isSessionComplete, endSession } = require('./tarot-session');
const { drawTarotCard } = require('./tarot-engine');
const { CARD_OPTIONS } = require('./card-data');

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

async function sendButtonMessage(userId, text) {
  const keyboard = {
    inline_keyboard: [[
      { text: '🃏 Card 1', callback_data: 'card_0' },
      { text: '🃏 Card 2', callback_data: 'card_1' },
      { text: '🃏 Card 3', callback_data: 'card_2' }
    ]]
  };
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: userId,
    text,
    reply_markup: keyboard
  });
}

async function handleCallbackQuery(query) {
  const userId = query.from.id;
  const data = query.data;
  const messageId = query.message.message_id;

  if (!data.startsWith('card_')) return;

  const cardIndex = parseInt(data.split('_')[1]);
  const card = await getCard(userId, cardIndex);

  if (!card) {
    await answerCallback(query.id, '⚠️ Session not found or card already drawn.');
    return;
  }

  const interpretation = drawTarotCard(card);
  const position = ['Past', 'Present', 'Future'][cardIndex];

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: userId,
    text: `🔮 *${position}* — *${card.name}*\n${interpretation}`,
    parse_mode: 'Markdown'
  });

  if (await isSessionComplete(userId)) {
    await endSession(userId);
    await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
      chat_id: userId,
      message_id: messageId,
      reply_markup: { inline_keyboard: [] } // 🔒 清除按钮
    });
  }

  await answerCallback(query.id);
}

async function answerCallback(callbackId, text) {
  await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
    callback_query_id: callbackId,
    text: text || '',
    show_alert: false
  });
}

module.exports = {
  sendButtonMessage,
  handleCallbackQuery
};
