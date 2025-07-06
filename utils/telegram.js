// v1.2.1
const axios = require('axios');
const { startSession, getCard, isSessionComplete, endSession } = require('./tarot-session.js');
const { cards } = require('./card-data.js');

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendButtonMessage(userId, amount) {
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🃏 Card 1', callback_data: 'draw_0' },
        { text: '🃏 Card 2', callback_data: 'draw_1' },
        { text: '🃏 Card 3', callback_data: 'draw_2' }
      ]
    ]
  };

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: userId,
    text: `🎉 Received ${amount} USDT! Click a card to reveal your reading:`,
    reply_markup: keyboard
  });

  await startSession(userId, amount);
}

async function handleCallbackQuery(callbackQuery) {
  const userId = callbackQuery.from.id;
  const data = callbackQuery.data;

  if (!data.startsWith('draw_')) return;

  const index = parseInt(data.split('_')[1]);
  const { card, position, error } = getCard(userId, index);

  if (error) {
    await sendTelegramMessage(userId, `⚠️ ${error}`);
    return;
  }

  const interpretation = `🔮 *${card.name}* (${position})\n${card.meaning}`;
  await sendTelegramMessage(userId, interpretation, true);

  if (isSessionComplete(userId)) {
    await endSession(userId);
    await removeButtons(callbackQuery.message.message_id, userId);
  }
}

async function sendTelegramMessage(userId, text, markdown = false) {
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: userId,
    text,
    parse_mode: markdown ? 'Markdown' : undefined
  });
}

async function removeButtons(messageId, userId) {
  await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
    chat_id: userId,
    message_id: messageId,
    reply_markup: { inline_keyboard: [] }
  });
}

module.exports = {
  sendButtonMessage,
  handleCallbackQuery
};
