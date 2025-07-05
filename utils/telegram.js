// ✅ utils/telegram.js（v1.1.2）
// 自动注入配置，无需设置环境变量
const axios = require("axios");

const BOT_TOKEN = "7842470393:AAG6T07t_fzzZIOBrccWKF-A_gGPweVGVZc";
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text, options = {}) {
  try {
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      ...options
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
      caption,
      parse_mode: "Markdown"
    });
  } catch (error) {
    console.error("Error sending photo:", error.response?.data || error.message);
  }
}

module.exports = { sendMessage, sendPhoto };
