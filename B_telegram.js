// B_telegram.js - v1.2.4

const axios = require('axios');
const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
const { startSession, getCard, isSessionComplete } = require('./G_tarot-session');

const OWNER_ID = 7685088782;

async function sendMessage(chatId, text, buttons) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
  };

  if (buttons) {
    payload.reply_markup = {
      inline_keyboard: [buttons.map((btn, i) => ({
        text: `🃏 Card ${i + 1}`,
        callback_data: `card_${i}`,
      }))]
    };
  }

  await axios.post(`${TELEGRAM_API}/sendMessage`, payload);
}

async function answerCallbackQuery(callbackQueryId, text) {
  await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
    callback_query_id: callbackQueryId,
    text,
    show_alert: false
  });
}

async function editMessage(chatId, messageId, newText) {
  await axios.post(`${TELEGRAM_API}/editMessageText`, {
    chat_id: chatId,
    message_id: messageId,
    text: newText,
    parse_mode: 'Markdown'
  });
}

async function handleTelegramUpdate(update) {
  // Handle button callbacks
  if (update.callback_query) {
    const { id, from, data, message } = update.callback_query;
    const userId = from.id;
    const messageId = message.message_id;
    const cardIndex = parseInt(data.split('_')[1], 10);

    try {
      const card = getCard(userId, cardIndex);

      if (!card) {
        await answerCallbackQuery(id, '⚠️ Invalid card or session expired.');
        return;
      }

      const { name, meaning, image, amount, cards } = card;
      const imageText = image ? `🖼 [Card Image](${image})\n` : '';
      const result = `🔮 *${name}*\n${imageText}${meaning}\n\n💰 *You paid:* ${amount ?? 'N/A'} USDT`;

      await answerCallbackQuery(id, `✨ You selected Card ${cardIndex + 1}`);
      await editMessage(userId, messageId, result);

      if (isSessionComplete(userId)) {
        // Hide all buttons by editing message again
        await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
          chat_id: userId,
          message_id: messageId,
          reply_markup: { inline_keyboard: [] }
        });
      }

    } catch (err) {
      console.error('❌ Callback error:', err.message);
      await answerCallbackQuery(id, '⚠️ An error occurred. Please try again.');
    }

    return;
  }

  // Handle commands like /start and /test123
  if (update.message && update.message.text) {
    const { chat, text, from } = update.message;

    if (text === '/test123' && from.id === OWNER_ID) {
      console.log('🧪 Triggering test session for developer...');
      startSession(chat.id, 12);

      await sendMessage(chat.id, '🧙 *Your divine reading begins...*\nPlease choose your card:', [0, 1, 2]);
      return;
    }

    if (text === '/start') {
      await sendMessage(chat.id, '✨ Welcome to the Divine Oracle.\nPlease send a payment to begin your reading.');
      return;
    }
  }
}

module.exports = { handleTelegramUpdate };
