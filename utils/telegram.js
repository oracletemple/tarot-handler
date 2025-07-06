// utils/telegram.js - v1.2.3
import axios from 'axios';
import { startSession, getCard, isSessionComplete } from './tarot-session.js';
import cardData from './card-data.js';

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendButtonMessage(userId, type = 'basic') {
  try {
    await startSession(userId);

    const buttons = [
      [{ text: '🃏 Card 1', callback_data: `card_1` }],
      [{ text: '🃏 Card 2', callback_data: `card_2` }],
      [{ text: '🃏 Card 3', callback_data: `card_3` }],
    ];

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: userId,
      text: `✨ Please choose your cards one by one:`,
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  } catch (error) {
    console.error('❌ Error sending button message:', error.message);
  }
}

export async function handleCallbackQuery(query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const userId = query.from.id;
  const data = query.data;

  if (!data.startsWith('card_')) {
    return;
  }

  const index = parseInt(data.split('_')[1]) - 1;
  const card = getCard(userId, index);

  if (!card) {
    await answerCallbackQuery(query.id, '⚠️ Session not found. Please try again later.');
    return;
  }

  const { name, meaning, image } = cardData.find(c => c.name === card) || {};
  const label = ['Past', 'Present', 'Future'][index] || `Card ${index + 1}`;

  let message = `🔮 <b>${label}</b>\n🃏 <b>${name}</b>\n\n${meaning || '_No interpretation yet._'}`;

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: message,
    parse_mode: 'HTML',
  });

  // 清除当前按钮
  const updatedButtons = query.message.reply_markup?.inline_keyboard?.filter(
    row => !row.some(btn => btn.callback_data === data)
  );

  await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: {
      inline_keyboard: updatedButtons,
    },
  });

  if (isSessionComplete(userId)) {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: `✅ You've drawn all 3 cards. Thank you for your divine insight journey!`,
    });
  }

  await answerCallbackQuery(query.id);
}

async function answerCallbackQuery(callbackQueryId, text = '') {
  try {
    await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
      callback_query_id: callbackQueryId,
      text,
    });
  } catch (error) {
    console.error('❌ Error answering callback query:', error.message);
  }
}
