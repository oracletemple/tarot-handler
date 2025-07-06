// utils/telegram.js - v1.2.2

import axios from 'axios';
import dotenv from 'dotenv';
import { startSession, getCard, isSessionComplete } from './tarot-session.js';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// 🧠 发送包含抽牌按钮的消息
export async function sendButtonMessage(userId, amount) {
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🃏 Card 1', callback_data: 'draw_1' },
        { text: '🃏 Card 2', callback_data: 'draw_2' },
        { text: '🃏 Card 3', callback_data: 'draw_3' }
      ]
    ]
  };

  const message = amount >= 30
    ? `🌟 Thank you for your **${amount} USDT** payment!\n\nWelcome to the premium Tarot & Spiritual Insight session.\n\nClick the cards below to reveal your reading:`
    : `🔮 Thank you for your **${amount} USDT** payment!\n\nClick the cards below to begin your tarot journey:`;

  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: userId,
      text: message,
      parse_mode: 'Markdown',
      reply_markup: keyboard
    });

    await startSession(userId); // 初始化 session
  } catch (error) {
    console.error('❌ Failed to send button message:', error?.response?.data || error.message);
  }
}

// 🎯 处理按钮点击
export async function handleCallbackQuery(data) {
  const { callback_query } = data;
  const userId = callback_query.from.id;
  const messageId = callback_query.message.message_id;
  const chatId = callback_query.message.chat.id;
  const action = callback_query.data;

  const match = action.match(/^draw_(\d)$/);
  if (!match) return;

  const cardIndex = parseInt(match[1], 10);

  try {
    const card = await getCard(userId, cardIndex);
    if (!card) {
      await answerCallback(callback_query.id, '⚠️ Session not found or card already drawn.');
      return;
    }

    const cardText = `✨ *${card.name}*\n_${card.position}_\n\n${card.meaning}`;
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: cardText,
      parse_mode: 'Markdown'
    });

    await answerCallback(callback_query.id);

    // ✅ 如果抽完三张牌，移除按钮
    if (await isSessionComplete(userId)) {
      await removeInlineKeyboard(chatId, messageId);
    }
  } catch (error) {
    console.error('❌ Callback handling error:', error?.response?.data || error.message);
  }
}

// ✅ 回复 Telegram callback，防止 loading 卡住
async function answerCallback(callbackId, text = '') {
  try {
    await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
      callback_query_id: callbackId,
      text: text
    });
  } catch (err) {
    console.warn('⚠️ Failed to answer callback:', err?.response?.data || err.message);
  }
}

// ✅ 删除按钮（编辑原消息）
async function removeInlineKeyboard(chatId, messageId) {
  try {
    await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: { inline_keyboard: [] }
    });
  } catch (err) {
    console.warn('⚠️ Failed to remove inline keyboard:', err?.response?.data || err.message);
  }
}
