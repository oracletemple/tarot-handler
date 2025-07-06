// B_telegram.js - v1.2.3

const axios = require("axios");

const { startSession, isSessionComplete, getCard } = require("./G_tarot-session");
const { getCardMessage } = require("./G_tarot-engine");
const { sendMessage, sendCardImage } = require("./G_send-message");

const BOT_TOKEN = process.env.BOT_TOKEN;
const RECEIVER_ID = process.env.RECEIVER_ID;

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
 * 处理普通消息（仅处理 /start 或 12 USDT 转账确认）
 */
async function handleMessage(message) {
  const userId = message.from.id;
  const text = message.text || "";

  if (text === "/start") {
    await sendMessage(userId, "Welcome to Divine Oracle 🔮\n\nPlease send 12 USDT to begin your tarot reading.");
  } else if (text.includes("USDT")) {
    if (userId.toString() === RECEIVER_ID) {
      await startSession(userId);
      await sendMessage(userId, "🧿 Your spiritual reading is ready. Please choose a card to reveal:", {
        reply_markup: {
          inline_keyboard: [[
            { text: "🃏 Card 1", callback_data: "card_1_12" },
            { text: "🃏 Card 2", callback_data: "card_2_12" },
            { text: "🃏 Card 3", callback_data: "card_3_12" }
          ]]
        }
      });
    }
  }
}

/**
 * 处理按钮点击
 */
async function handleCallback(query) {
  const userId = query.from.id;
  const data = query.data;

  const match = data?.match(/^card_(\d)_(\d+)$/);
  if (!match) {
    return sendMessage(userId, "⚠️ Invalid card selection.");
  }

  const index = parseInt(match[1], 10);
  const amount = parseInt(match[2], 10);

  const valid = await isSessionComplete(userId, index);
  if (!valid) {
    const card = await getCard(userId, index);
    const cardMessage = getCardMessage(card, index, amount);

    if (card.image) {
      await sendCardImage(userId, card.image, cardMessage);
    } else {
      await sendMessage(userId, cardMessage);
    }
  } else {
    await sendMessage(userId, "⚠️ This card has already been revealed.");
  }
}

module.exports = { handleTelegramUpdate };
