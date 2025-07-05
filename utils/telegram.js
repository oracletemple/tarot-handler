// v1.1.9 - telegram.js
const axios = require("axios");
const { getCard, isSessionComplete, startSession } = require("./tarot-session");

const BOT_TOKEN = "7842470393:AAG6T07t_fzzZIOBrccWKF-A_gGPweVGVZc";
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text, options = {}) {
  try {
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      ...options,
    });
  } catch (error) {
    console.error("❌ Failed to send message:", error?.response?.data || error.message);
  }
}

async function editMessageReplyMarkup(chatId, messageId, replyMarkup) {
  try {
    await axios.post(`${API_URL}/editMessageReplyMarkup`, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: replyMarkup,
    });
  } catch (error) {
    console.error("❌ Failed to edit reply markup:", error?.response?.data || error.message);
  }
}

async function sendCardButtons(userId, clear = false) {
  if (clear) {
    await editMessageReplyMarkup(userId, undefined, { inline_keyboard: [] });
    return;
  }

  const buttons = [
    [{ text: "🃏 Card 1", callback_data: "card_1" }],
    [{ text: "🃏 Card 2", callback_data: "card_2" }],
    [{ text: "🃏 Card 3", callback_data: "card_3" }],
  ];

  await sendMessage(userId, "Please choose your card:", {
    reply_markup: { inline_keyboard: buttons },
  });
}

async function handleTransaction({ callback_query }) {
  const userId = callback_query.from.id;
  const data = callback_query.data;
  const messageId = callback_query.message.message_id;

  const cardIndex = parseInt(data.replace("card_", ""));
  if (isNaN(cardIndex)) return;

  const result = await getCard(userId, cardIndex);

  if (result.error) {
    await sendMessage(userId, `⚠️ ${result.error}`);
    return;
  }

  await sendMessage(userId, result.text);

  if (isSessionComplete(userId)) {
    await editMessageReplyMarkup(userId, messageId, { inline_keyboard: [] });
  }
}

module.exports = {
  sendMessage,
  sendCardButtons,
  handleTransaction,
};
