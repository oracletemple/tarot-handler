// utils/telegram.js - v1.2.4

import fetch from 'node-fetch';
import cardData from './card-data.js';
import { startSession, getCard, isSessionComplete } from './tarot-session.js';

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendMessage(chatId, text, extra = {}) {
  await fetch(`${API_URL}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, ...extra }),
  });
}

export async function sendButtonMessage(chatId, amount) {
  const keyboard = {
    inline_keyboard: [
      [{ text: '🃏 Card 1', callback_data: 'card_1' }],
      [{ text: '🃏 Card 2', callback_data: 'card_2' }],
      [{ text: '🃏 Card 3', callback_data: 'card_3' }],
    ],
  };

  await sendMessage(chatId, `🎴 You've sent ${amount} USDT.\nPlease pick 3 cards one by one:`, {
    reply_markup: keyboard,
  });

  startSession(chatId, amount);
}

export async function handleCallbackQuery(callbackQuery) {
  const { message, data, from, id } = callbackQuery;
  const userId = from.id;
  const messageId = message.message_id;
  const chatId = message.chat.id;

  const cardIndex = parseInt(data.split('_')[1]) - 1;
  if (isNaN(cardIndex)) return;

  const card = getCard(userId, cardIndex);
  if (!card) {
    await answerCallback(id, '⚠️ Session not found or already completed.');
    return;
  }

  const text = `🃏 You picked: *${card.name}*\n_${card.meaning}_`;
  const imageUrl = card.image;

  await answerCallback(id);

  if (imageUrl) {
    await sendPhoto(chatId, imageUrl, { caption: text, parse_mode: 'Markdown' });
  } else {
    await sendMessage(chatId, text, { parse_mode: 'Markdown' });
  }

  // 自动删除按钮（抽完3张）
  if (isSessionComplete(userId)) {
    await editReplyMarkup(chatId, messageId, null);
  }
}

async function sendPhoto(chatId, photoUrl, extra = {}) {
  await fetch(`${API_URL}/sendPhoto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, photo: photoUrl, ...extra }),
  });
}

async function editReplyMarkup(chatId, messageId, replyMarkup) {
  await fetch(`${API_URL}/editMessageReplyMarkup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId, reply_markup: replyMarkup }),
  });
}

async function answerCallback(callbackQueryId, text = '') {
  await fetch(`${API_URL}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text }),
  });
}
