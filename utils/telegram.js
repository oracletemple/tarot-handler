// utils/telegram.js
// v1.2.2

import axios from 'axios';
import { startSession, getCard, isSessionComplete } from './tarot-session.js';

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendButtonMessage(userId, amount) {
  try {
    await startSession(userId, amount);
    const buttons = {
      inline_keyboard: [
        [
          { text: '🃏 Card 1', callback_data: 'card_1' },
          { text: '🃏 Card 2', callback_data: 'card_2' },
          { text: '🃏 Card 3', callback_data: 'card_3' }
        ]
      ]
    };

    const message = `🔮 Thank you for your ${amount} USDT!\n\nClick the cards below to reveal your spiritual guidance:`;
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: userId,
      text: message,
      reply_markup: buttons
    });
  } catch (error) {
    console.error('❌ Failed to send button message:', error.message);
  }
}

export async function handleCallbackQuery(query) {
  try {
    const userId = query.from?.id;
    const data = query.data;

    if (!userId || !data) {
      console.warn('⚠️ Missing user_id or callback data');
      return;
    }

    const index = parseInt(data.split('_')[1], 10);
    const card = await getCard(userId, index);

    if (!card) {
      await answerCallback(query.id, "⚠️ Session not found or expired.");
      return;
    }

    const message = `🃏 *${card.name}*\n\n${card.meaning}`;
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: userId,
      text: message,
      parse_mode: 'Markdown'
    });

    await answerCallback(query.id);

    if (isSessionComplete(userId)) {
      // Remove buttons after all cards revealed
      await axios.post(`${API_URL}/editMessageReplyMarkup`, {
        chat_id: userId,
        message_id: query.message.message_id,
        reply_markup: { inline_keyboard: [] }
      });
    }

  } catch (error) {
    console.error('❌ Error in handleCallbackQuery:', error.message);
  }
}

async function answerCallback(callbackQueryId, text = '') {
  try {
    await axios.post(`${API_URL}/answerCallbackQuery`, {
      callback_query_id: callbackQueryId,
      text
    });
  } catch (error) {
    console.error('❌ Failed to answer callback query:', error.message);
  }
}
