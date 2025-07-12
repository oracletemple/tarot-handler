// G_send-message.js - v1.1.3

const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * 发送纯文本消息
 * @param {number} chatId 
 * @param {string} text 
 */
async function sendText(chatId, text) {
  try {
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "Markdown"
    });
  } catch (err) {
    console.error("❌ sendText error:", err.response?.data || err.message);
  }
}

/**
 * 发送带按钮的消息（通常用于抽牌入口）
 * @param {number} chatId 
 * @param {string} text 
 * @param {Array[]} buttons - 二维数组格式：[ [ { text, callback_data } ] ]
 */
async function sendButtons(chatId, text, buttons) {
  try {
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: buttons
      }
    });
  } catch (err) {
    console.error("❌ sendButtons error:", err.response?.data || err.message);
  }
}

/**
 * 发送图片 + 文字说明（通常用于塔罗牌展示）
 * @param {number} chatId 
 * @param {string} imageUrl 
 * @param {string} caption 
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

module.exports = {
  sendText,
  sendButtons,
  sendImage
};
