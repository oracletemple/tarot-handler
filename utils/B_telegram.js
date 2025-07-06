// B_telegram.js - v1.2.3

const axios = require("axios");
const { startSession, getCard, isSessionComplete } = require("./B_tarot-session");
const { sendMessage, sendCardMessage, removeButtons } = require("./utils/send-message");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const RECEIVER_ID = parseInt(process.env.RECEIVER_ID);
const AMOUNT_THRESHOLD = parseFloat(process.env.AMOUNT_THRESHOLD || "10");

async function handleTelegramUpdate(update) {
  // ➤ /start 指令
  if (update.message?.text === "/start") {
    return sendMessage(update.message.chat.id, "Welcome to Divine Tarot 🔮\nPlease send your payment to begin.");
  }

  // ➤ /test123 开发者后门（仅限 RECEIVER_ID）
  if (update.message?.text === "/test123" && update.message.from.id === RECEIVER_ID) {
    await startSession(RECEIVER_ID, 12);
    return sendMessage(RECEIVER_ID, "✅ Test session created. Click the buttons to reveal your cards:", [
      ["🃏 Card 1", "card_1_12"],
      ["🃏 Card 2", "card_2_12"],
      ["🃏 Card 3", "card_3_12"]
    ]);
  }

  // ➤ 正式按钮点击事件（card_1_12 / card_2_12 / card_3_30 等）
  if (update.callback_query) {
    const data = update.callback_query.data;
    const from = update.callback_query.from;
    const messageId = update.callback_query.message.message_id;
    const chatId = update.callback_query.message.chat.id;

    const match = data?.match(/^card_(\d)_(\d+)/);
    if (!match) return;

    const index = parseInt(match[1]);
    const amount = parseFloat(match[2]);

    // 防止无效金额或非法访问
    if (isNaN(amount) || amount < AMOUNT_THRESHOLD) {
      return sendMessage(chatId, `⚠️ Received ${amount || "undefined"} USDT, which is below the minimum threshold.`);
    }

    const card = await getCard(from.id, index, amount);
    if (!card) {
      return sendMessage(chatId, "⚠️ Session not found. Please try again later.");
    }

    await sendCardMessage(chatId, card, index);

    // 抽完 3 张后自动移除按钮
    if (isSessionComplete(from.id)) {
      await removeButtons(chatId, messageId);
    }
  }
}

module.exports = { handleTelegramUpdate };
