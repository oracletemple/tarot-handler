// v1.1.3 - utils/telegram.js (with sendButtons)

const axios = require("axios");

const BOT_TOKEN = "7842470393:AAG6T07t_fzzZIOBrccWKF-A_gGPweVGVZc";
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text) {
  try {
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown"
    });
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
  }
}

async function sendPhoto(chatId, imageUrl, caption = "") {
  try {
    await axios.post(`${API_URL}/sendPhoto`, {
      chat_id: chatId,
      photo: imageUrl,
      caption: caption,
      parse_mode: "Markdown"
    });
  } catch (error) {
    console.error("Error sending photo:", error.response?.data || error.message);
  }
}

async function sendButtons(chatId, prompt) {
  try {
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text: prompt,
      reply_markup: {
        keyboard: [
          [{ text: "🃏 Card 1" }, { text: "🃏 Card 2" }, { text: "🃏 Card 3" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true
      }
    });
  } catch (error) {
    console.error("Error sending buttons:", error.response?.data || error.message);
  }
}

module.exports = { sendMessage, sendPhoto, sendButtons };
