// telegram.js - v1.2.2

import fetch from 'node-fetch';
import cardData from './card-data.js';
import {
  startSession,
  getCard,
  isSessionComplete,
  removeCardFromSession,
  getSession
} from './tarot-session.js';

const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.RECEIVER_ID;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

// 发送初始按钮消息
export async function sendButtonMessage(userId, amount) {
  startSession(userId, amount);

  const message = `🃏 Please choose your card one by one:\n(Click to reveal each card's meaning)`;
  const keyboard = {
    inline_keyboard: [
      [
        { text: '🔮 Card 1', callback_data: 'card_1' },
        { text: '🔮 Card 2', callback_data: 'card_2' },
        { text: '🔮 Card 3', callback_data: 'card_3' }
      ]
    ]
  };

  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: userId,
      text: message,
      reply_markup: keyboard
    })
  });
}

// 处理按钮点击事件
export async function handleCallbackQuery(callbackQuery) {
  const { message, from, data, id } = callbackQuery;
  const userId = from.id;
  const index = parseInt(data.split('_')[1]) - 1;

  const session = getSession(userId);
  if (!session) {
    await answerCallback(id, '⚠️ Session not found. Please try again later.');
    return;
  }

  if (session.cardsDrawn.length > index) {
    await answerCallback(id, '✅ You already opened this card.');
    return;
  }

  const cardIndex = getCard(userId, index);
  if (cardIndex === null) {
    await answerCallback(id, '⚠️ Invalid card selection.');
    return;
  }

  const card = cardData[cardIndex];
  if (!card) {
    await answerCallback(id, '⚠️ Card data not found.');
    return;
  }

  removeCardFromSession(userId, cardIndex);

  const imageBlock = card.image
    ? `<a href="${card.image}">&#8205;</a>`
    : '';
  const messageText = `${imageBlock}✨ <b>${card.name}</b>\n${card.meaning}`;

  await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: userId,
      text: messageText,
      parse_mode: 'HTML',
      disable_web_page_preview: false
    })
  });

  await answerCallback(id, '🔮 Card revealed.');

  if (isSessionComplete(userId)) {
    await fetch(`${TELEGRAM_API}/editMessageReplyMarkup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: message.chat.id,
        message_id: message.message_id,
        reply_markup: { inline_keyboard: [] }
      })
    });
  }
}

// 回复按钮点击反馈
async function answerCallback(callbackId, text) {
  await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      callback_query_id: callbackId,
      text
    })
  });
}
