// telegram.js - v1.2.4
// ✅ 修复测试按钮点击报错问题
// ✅ 支持开发者手动测试时跳过 session 校验（userId 白名单）
import axios from "axios";
import cardData from "./card-data.js";
import { getCard, startSession, isSessionComplete } from "./tarot-session.js";

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

const DEV_WHITELIST = [7685088782]; // ✅ 开发者 userId 白名单

async function sendMessage(chatId, text, extra = {}) {
  try {
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      ...extra,
    });
  } catch (err) {
    console.error("❌ sendMessage error:", err?.response?.data || err.message);
  }
}

async function editMessageReplyMarkup(chatId, messageId, markup) {
  try {
    await axios.post(`${API_URL}/editMessageReplyMarkup`, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: markup,
    });
  } catch (err) {
    console.error("❌ editReplyMarkup error:", err?.response?.data || err.message);
  }
}

async function sendCard(chatId, card) {
  const caption = `🃏 *${card.name}*\n\n${card.meaning}`;
  const options = {
    parse_mode: "Markdown",
  };

  if (card.image) {
    await axios.post(`${API_URL}/sendPhoto`, {
      chat_id: chatId,
      photo: card.image,
      caption,
      ...options,
    });
  } else {
    await sendMessage(chatId, caption, options);
  }
}

export async function handleCallbackQuery(callback) {
  const userId = callback.from?.id;
  const messageId = callback.message?.message_id;
  const chatId = callback.message?.chat?.id || userId;
  const data = callback.data;

  if (!userId || !data || !chatId) return;

  const cardIndex = {
    card_1: 0,
    card_2: 1,
    card_3: 2,
  }[data];

  if (cardIndex === undefined) return;

  // ✅ 如果是开发者测试，跳过 session 校验
  let card;
  if (DEV_WHITELIST.includes(userId)) {
    card = cardData[Math.floor(Math.random() * cardData.length)];
  } else {
    const sessionCard = await getCard(userId, cardIndex);
    if (!sessionCard) {
      await sendMessage(chatId, "⚠️ Session not found. Please try again later.");
      return;
    }
    card = sessionCard;
  }

  await sendCard(chatId, card);

  // ✅ 逐张移除按钮，避免重复点击
  await editMessageReplyMarkup(chatId, messageId, { inline_keyboard: [[]] });

  // ✅ 如果是最后一张牌，附加结束提示
  if (!DEV_WHITELIST.includes(userId) && (await isSessionComplete(userId))) {
    await sendMessage(chatId, "🌟 You have drawn 3 cards. Thank you for using Divine Oracle!");
  }
}
