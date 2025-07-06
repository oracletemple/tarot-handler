// v1.2.2
const axios = require('axios');
const { getCard, isSessionComplete, endSession } = require('./tarot-session');
const { formatCardMessage } = require('./tarot-engine');

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

async function sendButtonMessage(chatId, text) {
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🃏 Card 1', callback_data: 'card_0' },
        { text: '🃏 Card 2', callback_data: 'card_1' },
        { text: '🃏 Card 3', callback_data: 'card_2' },
      ],
    ],
  };

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text,
    reply_markup: keyboard,
  });
}

async function handleCallbackQuery(req, res) {
  const { callback_query } = req.body;
  const userId = callback_query.from.id;
  const messageId = callback_query.message.message_id;
  const data = callback_query.data;

  const index = parseInt(data.split('_')[1], 10);
  const card = getCard(userId, index);

  if (!card) {
    await answerCallback(callback_query.id, `⚠️ Session not found or card already drawn.`);
    return res.sendStatus(200);
  }

  const cardText = formatCardMessage(card);

  // 回应按钮点击并推送卡牌内容
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: userId,
    text: cardText,
    parse_mode: 'HTML',
  });

  // 如果三张牌已抽完，则结束 session 并删除按钮
  if (isSessionComplete(userId)) {
    await endSession(userId);
    await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
      chat_id: userId,
      message_id: messageId,
      reply_markup: { inline_keyboard: [] },
    });
  }

  await answerCallback(callback_query.id);
  res.sendStatus(200);
}

async function answerCallback(callbackId, text = '') {
  await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
    callback_query_id: callbackId,
    text,
    show_alert: false,
  });
}

module.exports = {
  handleCallbackQuery,
  sendButtonMessage, // ✅ 必须导出此函数
};
