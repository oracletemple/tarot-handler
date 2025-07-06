// B_telegram.js - v1.2.3

const { startSession, isSessionComplete, getCard, advanceSession } = require("./G_tarot-session");
const { getCardMessage } = require("./G_tarot-engine");
const { sendText, sendButtons, sendImage } = require("./G_send-message");

/**
 * 处理 Telegram 的 update 数据（包括 message 和 callback_query）
 */
async function handleTelegramUpdate(update) {
  if (update.message) {
    await handleMessage(update.message);
  } else if (update.callback_query) {
    await handleCallback(update.callback_query);
  }
}

/**
 * 处理普通文本消息（用于测试命令或引导语）
 */
async function handleMessage(message) {
  const userId = message.from.id;
  const text = message.text || "";

  if (text === "/start") {
    await sendText(userId, "🔮 Welcome to Divine Oracle!\n\nPlease send *12 USDT* to begin your tarot reading.");
  }
}

/**
 * 处理按钮点击
 */
async function handleCallback(query) {
  const userId = query.from.id;
  const data = query.data;

  const match = data?.match(/^card_(\d)_(\d+)$/);
  if (!match) return sendText(userId, "⚠️ Invalid card selection.");

  const index = parseInt(match[1], 10) - 1;
  const amount = parseInt(match[2], 10);

  if (isSessionComplete(userId)) {
    return sendText(userId, "⚠️ Your session has ended. Please send a new payment to begin again.");
  }

  const cardId = getCard(userId, index);
  if (cardId === null) {
    return sendText(userId, "⚠️ Session not found. Please try again later.");
  }

  const message = getCardMessage(cardId, index, amount);
  if (cardId.image) {
    await sendImage(userId, cardId.image, message);
  } else {
    await sendText(userId, message);
  }

  advanceSession(userId);
}

module.exports = { handleTelegramUpdate };
