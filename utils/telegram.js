// telegram.js - v1.2.3

import axios from 'axios';
import cardData from './card-data.js';
import { startSession, getCard, isSessionComplete, removeCardFromSession } from './tarot-session.js';

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendTarotButtons(userId, amount) {
  if (!userId || !amount) {
    console.warn('⚠️ Missing user_id or amount');
    return;
  }

  await startSession(userId, amount);

  const buttons = [
    [{ text: '🃏 Card 1', callback_data: `draw_1_${amount}` }],
    [{ text: '🃏 Card 2', callback_data: `draw_2_${amount}` }],
    [{ text: '🃏 Card 3', callback_data: `draw_3_${amount}` }]
  ];

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: userId,
    text: `Thank you for your ${amount} USDT payment! ✨\nPlease pick a card:`,
    reply_markup: {
      inline_keyboard: buttons
    }
  });
}

export async function handleCallbackQuery(callbackQuery) {
  const { id, from, data, message } = callbackQuery;
  const userId = from.id;
  const msgId = message.message_id;

  const match = data.match(/^draw_(\d)_(\d+)/);
  if (!match) return;

  const index = parseInt(match[1]);
  const amount = parseInt(match[2]);

  const card = getCard(userId, index);
  if (!card) {
    await answerCallbackQuery(id, '⚠️ Session not found or card already drawn.');
    return;
  }

  // 发送抽到的牌信息
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: userId,
    text: `You drew:
*${card.name}*
${card.meaning}`,
    parse_mode: 'Markdown'
  });

  // 移除当前按钮（只保留剩余未点击的）
  const remaining = [1, 2, 3].filter(i => i !== index && !isSessionComplete(userId, i));
  const newButtons = remaining.map(i => [{ text: `🃏 Card ${i}`, callback_data: `draw_${i}_${amount}` }]);

  await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
    chat_id: userId,
    message_id: msgId,
    reply_markup: { inline_keyboard: newButtons }
  });

  // 如果已经抽满 3 张，自动提示
  if (isSessionComplete(userId)) {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: userId,
      text: 'You have drawn 3 cards. 🧘‍♀️ May their wisdom guide you.',
    });
  }

  await answerCallbackQuery(id);
}

async function answerCallbackQuery(callbackQueryId, text = '') {
  await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
    callback_query_id: callbackQueryId,
    text
  });
}
