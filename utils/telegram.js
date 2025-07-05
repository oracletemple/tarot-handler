// utils/telegram.js
// v1.1.4

const axios = require("axios");

// 内嵌环境变量
const BOT_TOKEN = "7842470393:AAG6T07t_fzzZIOBrccWKF-A_gGPweVGVZc";
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * 发送纯文本消息
 */
async function sendMessage(chatId, text, options = {}) {
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      ...options,
    });
  } catch (err) {
    console.error("❌ sendMessage error:", err?.response?.data || err.message);
  }
}

/**
 * 编辑原消息文本
 */
async function editMessageText(chatId, messageId, text, options = {}) {
  try {
    await axios.post(`${TELEGRAM_API}/editMessageText`, {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: "HTML",
      ...options,
    });
  } catch (err) {
    console.error("❌ editMessageText error:", err?.response?.data || err.message);
  }
}

/**
 * 发送带按钮的消息
 */
async function sendMessageWithButtons(chatId, text, buttons = []) {
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  } catch (err) {
    console.error("❌ sendMessageWithButtons error:", err?.response?.data || err.message);
  }
}

/**
 * 模拟用户点击按钮
 */
async function simulateClick(chatId, messageId, data) {
  try {
    await axios.post(`${TELEGRAM_API}/callbackQuery`, {
      chat_id: chatId,
      message_id: messageId,
      data,
    });
  } catch (err) {
    console.error("❌ simulateClick error:", err?.response?.data || err.message);
  }
}

module.exports = {
  sendMessage,
  sendMessageWithButtons,
  editMessageText,
  simulateClick,
};
