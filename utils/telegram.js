// utils/telegram.js
// v1.0.11
const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const RECEIVER_ID = process.env.RECEIVER_ID;

// 发送文本消息
async function sendMessage(text, buttons = null) {
  const payload = {
    chat_id: RECEIVER_ID,
    text,
    parse_mode: "Markdown",
  };

  if (buttons) {
    payload.reply_markup = {
      inline_keyboard: [buttons.map((btn) => ({
        text: btn.text,
        callback_data: btn.callback_data,
      }))],
    };
  }

  return axios.post(`${API_URL}/sendMessage`, payload);
}

// 发送牌按钮（用于12/30 USDT档）
function sendTarotButtons() {
  return sendMessage("🃏 Please choose your card:", [
    { text: "Card 1", callback_data: "card_1" },
    { text: "Card 2", callback_data: "card_2" },
    { text: "Card 3", callback_data: "card_3" },
  ]);
}

// 模拟点击按钮
function simulateClick(index) {
  const data = {
    callback_query: {
      from: { id: RECEIVER_ID },
      data: `card_${index}`,
    },
  };
  return axios.post(`${process.env.WEBHOOK_URL}`, data);
}

module.exports = {
  sendMessage,
  sendTarotButtons,
  simulateClick,
};
