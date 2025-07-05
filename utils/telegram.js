// v1.1.0 - utils/telegram.js (auto-filled with project .env values)

const axios = require("axios");

// ✅ 自动注入配置变量，无需 .env 设置
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

module.exports = { sendMessage, sendPhoto };
