// B_telegram.js - v1.2.3

const axios = require("axios");
const { startSession, getCard, isSessionComplete } = require("./B_tarot-session");
const { getCardData } = require("./B_tarot-engine");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * 主处理入口：统一处理所有 Telegram 更新（按钮点击或普通消息）
 */
async function handleTelegramUpdate(update) {
  if (update.callback_query) {
    await handleCardCallback(update.callback_query);
  } else if (update.message) {
    await handleTransactionMessage(update.message);
  }
}

/**
 * 按钮点击处理逻辑（card_1_12 / card_2_30 等）
 */
async function handleCardCallback(query) {
  const { id: callbackId, from, data, message } = query;
  const userId = from.id;
  const chatId = message.chat.id;

  // 👉 校验格式：card_1_12
  const match = data.match(/^card_(\d)_(\d+)$/);
  if (!match) {
    await answerCallback(callbackId, "❌ Invalid selection.");
    return;
  }

  const cardIndex = parseInt(match[1]);
  const amount = parseInt(match[2]);

  // 检查 session 是否存在
  if (!startSession.exists(userId)) {
    await answerCallback(callbackId, "⚠️ Session not found. Please try again later.");
    return;
  }

  // 获取抽到的牌
  const card = getCard(userId, cardIndex);
  const cardData = getCardData(card);

  // 回复牌内容
  const caption = `🃏 *${cardData.name}*\n_${cardData.meaning}_`;
  const imageUrl = cardData.image;

  await sendPhoto(chatId, imageUrl, caption);

  // 回应按钮点击（不再显示加载中）
  await answerCallback(callbackId, `✅ Card ${cardIndex} revealed`);

  // 如果三张牌已全部抽完，移除按钮
  if (isSessionComplete(userId)) {
    await removeInlineKeyboard(chatId, message.message_id);
  }
}

/**
 * 文本消息处理逻辑（如模拟的付款提示等）
 */
async function handleTransactionMessage(message) {
  const userId = message.from.id;
  const chatId = message.chat.id;
  const text = message.text || "";

  // 仅处理包含 USDT 金额的消息
  const match = text.match(/(\d+)\s*USDT/i);
  if (!match) return;

  const amount = parseInt(match[1]);

  // 判断金额
  if (amount < 10) {
    await sendMessage(chatId, `⚠️ Received ${amount} USDT, which is below the minimum threshold.`);
    return;
  }

  // 创建 session 并推送按钮
  startSession(userId);
  await sendCardButtons(chatId, amount);
}

/**
 * 推送抽牌按钮
 */
async function sendCardButtons(chatId, amount) {
  const buttons = [
    [{ text: "🃏 Card 1", callback_data: `card_1_${amount}` }],
    [{ text: "🃏 Card 2", callback_data: `card_2_${amount}` }],
    [{ text: "🃏 Card 3", callback_data: `card_3_${amount}` }],
  ];

  await axios.post(`${API_URL}/sendMessage`, {
    chat_id: chatId,
    text: "🔮 Your spiritual reading is ready. Please choose a card to reveal:",
    reply_markup: { inline_keyboard: buttons },
  });
}

/**
 * 回应按钮点击
 */
async function answerCallback(callbackId, text) {
  await axios.post(`${API_URL}/answerCallbackQuery`, {
    callback_query_id: callbackId,
    text,
    show_alert: false,
  });
}

/**
 * 删除内联键盘按钮
 */
async function removeInlineKeyboard(chatId, messageId) {
  await axios.post(`${API_URL}/editMessageReplyMarkup`, {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: { inline_keyboard: [] },
  });
}

/**
 * 通用文本发送
 */
async function sendMessage(chatId, text) {
  await axios.post(`${API_URL}/sendMessage`, {
    chat_id: chatId,
    text,
  });
}

/**
 * 发送图片与解读
 */
async function sendPhoto(chatId, imageUrl, caption) {
  await axios.post(`${API_URL}/sendPhoto`, {
    chat_id: chatId,
    photo: imageUrl,
    caption,
    parse_mode: "Markdown",
  });
}

module.exports = {
  handleTelegramUpdate,
};
