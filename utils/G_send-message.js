// G_send-message.js - v1.1.1

const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * 发送纯文本消息
 * @param {number} chatId
 * @param {string} text
 */
async function sendText(chatId, text) {
  await axios.post(`${API_URL}/sendMessage`, {
    chat_id: chatId,
    text
  });
}

/**
 * 发送带按钮的消息
 * @param {number} chatId
 * @param {string} text
 * @param {Array} buttons
 */
async function sendButtons(chatId, text, buttons) {
  await axios.post(`${API_URL}/sendMessage`, {
    chat_id: chatId,
    text,
    reply_markup: {
      inline_keyboard: [buttons]
    }
  });
}

/**
 * 发送带图片的消息（未来可用于牌图展示）
 * @param {number} chatId
 * @param {string} photoUrl
 * @param {string} caption
 */
async function sendImage(chatId, photoUrl, caption = "") {
  await axios.post(`${API_URL}/sendPhoto`, {
    chat_id: chatId,
    photo: photoUrl,
    caption
  });
}

module.exports = {
  sendText,
  sendButtons,
  sendImage
};
