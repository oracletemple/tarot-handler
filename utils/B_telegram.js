// B_telegram.js - v1.2.2
const axios = require("axios");
const { startSession, getCard, isSessionComplete, endSession } = require("./B_tarot-session");
const { getCardMeaning } = require("./B_tarot-engine");

const BOT_TOKEN = process.env.BOT_TOKEN;
const RECEIVER_ID = process.env.RECEIVER_ID;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text, buttons = null) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown"
  };

  if (buttons) {
    payload.reply_markup = {
      inline_keyboard: [buttons.map((btn) => ({ text: btn.text, callback_data: btn.data }))]
    };
  }

  await axios.post(`${API_URL}/sendMessage`, payload);
}

async function handleTextMessage(message) {
  const userId = message.from.id;
  const text = message.text;

  // 开发者测试入口
  if (text === "/test123" && userId.toString() === RECEIVER_ID) {
    console.log("🧪 Test session triggered by /test123");
    await startSession(userId, "12");
    await sendMessage(userId, "Your spiritual reading is ready. Please choose a card to reveal:", [
      { text: "🃏 Card 1", data: "card_1_12" },
      { text: "🃏 Card 2", data: "card_2_12" },
      { text: "🃏 Card 3", data: "card_3_12" }
    ]);
  }
}

async function handleCallbackQuery(callbackQuery) {
  const userId = callbackQuery.from.id;
  const data = callbackQuery.data;
  const messageId = callbackQuery.message.message_id;

  if (!data.startsWith("card_")) return;

  const parts = data.split("_");
  const cardIndex = parseInt(parts[1]);
  const tier = parts[2];

  const card = await getCard(userId, cardIndex);
  if (!card) {
    await sendMessage(userId, "⚠️ Session not found. Please try again later.");
    return;
  }

  const meaning = await getCardMeaning(card, cardIndex, tier);
  await sendMessage(userId, meaning);

  if (isSessionComplete(userId)) {
    endSession(userId);

    // 删除按钮消息
    await axios.post(`${API_URL}/editMessageReplyMarkup`, {
      chat_id: userId,
      message_id: messageId,
      reply_markup: { inline_keyboard: [] }
    });
  }
}

module.exports = {
  sendMessage,
  handleCallbackQuery,
  handleTextMessage
};
