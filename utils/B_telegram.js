// B_telegram.js // v1.2.3

const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Send message with optional inline keyboard buttons.
 * @param {number} chatId 
 * @param {string} text 
 * @param {object} [buttons] - Optional inline keyboard
 */
async function sendMessage(chatId, text, buttons = null) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
  };

  if (buttons) {
    payload.reply_markup = {
      inline_keyboard: buttons
    };
  }

  try {
    await axios.post(`${API_URL}/sendMessage`, payload);
  } catch (err) {
    console.error("❌ Telegram sendMessage error:", err.response?.data || err.message);
  }
}

/**
 * Edit the reply markup (e.g. remove buttons) of an existing message
 * @param {number} chatId 
 * @param {number} messageId 
 */
async function removeButtons(chatId, messageId) {
  try {
    await axios.post(`${API_URL}/editMessageReplyMarkup`, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: { inline_keyboard: [] }
    });
  } catch (err) {
    console.error("❌ Telegram removeButtons error:", err.response?.data || err.message);
  }
}

/**
 * Answer callback query (optional popup on click)
 * @param {string} callbackQueryId 
 * @param {string} text 
 */
async function answerCallback(callbackQueryId, text) {
  try {
    await axios.post(`${API_URL}/answerCallbackQuery`, {
      callback_query_id: callbackQueryId,
      text,
      show_alert: false
    });
  } catch (err) {
    console.error("❌ Telegram answerCallback error:", err.response?.data || err.message);
  }
}

module.exports = {
  sendMessage,
  removeButtons,
  answerCallback
};
