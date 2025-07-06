// B_send-message.js - v1.1.1

const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Send a text message to a user.
 * @param {number} chatId
 * @param {string} text
 * @param {object} [options]
 */
async function sendMessage(chatId, text, options = {}) {
  try {
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      ...options
    });
  } catch (err) {
    console.error("❌ sendMessage error:", err.response?.data || err.message);
  }
}

/**
 * Send an image with optional caption.
 * @param {number} chatId
 * @param {string} imageUrl
 * @param {string} [caption]
 */
async function sendImage(chatId, imageUrl, caption = "") {
  try {
    await axios.post(`${API_URL}/sendPhoto`, {
      chat_id: chatId,
      photo: imageUrl,
      caption,
      parse_mode: "Markdown"
    });
  } catch (err) {
    console.error("❌ sendImage error:", err.response?.data || err.message);
  }
}

/**
 * Send buttons for card selection (1/2/3).
 * @param {number} chatId
 * @param {number} amount - 12 or 30
 */
async function sendCardButtons(chatId, amount) {
  try {
    const buttons = [1, 2, 3].map(i => ({
      text: `🃏 Card ${i}`,
      callback_data: `card_${i}_${amount}`
    }));

    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text: "Your spiritual reading is ready. Please choose a card to reveal:",
      reply_markup: {
        inline_keyboard: [buttons]
      }
    });
  } catch (err) {
    console.error("❌ sendCardButtons error:", err.response?.data || err.message);
  }
}

/**
 * Edit inline keyboard to remove buttons after 3 draws.
 * @param {number} chatId
 * @param {number} messageId
 */
async function removeCardButtons(chatId, messageId) {
  try {
    await axios.post(`${API_URL}/editMessageReplyMarkup`, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: { inline_keyboard: [] }
    });
  } catch (err) {
    console.error("❌ removeCardButtons error:", err.response?.data || err.message);
  }
}

module.exports = {
  sendMessage,
  sendImage,
  sendCardButtons,
  removeCardButtons
};
