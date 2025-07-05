// v1.1.2 - utils/telegram.js

const axios = require("axios");

// ✅ 自动注入配置变量，无需手动设置
const BOT_TOKEN = "7842470393:AAG6T07t_fzzZIOBrccWKF-A_gGPweVGVZc";
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// ✅ 发送文字消息
async function sendMessage(chatId, text) {
  try {
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "Markdown"
    });
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error.message);
  }
}

// ✅ 发送图片
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

// ✅ 发送按钮消息（用于抽牌交互）
async function sendCardButtons(chatId) {
  const replyMarkup = {
    inline_keyboard: [
      [{ text: "🃏 Card 1", callback_data: "card_1" }],
      [{ text: "🃏 Card 2", callback_data: "card_2" }],
      [{ text: "🃏 Card 3", callback_data: "card_3" }]
    ]
  };

  try {
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text: "We've received your payment.\nPlease choose a card below to begin your reading:",
      reply_markup: replyMarkup
    });
  } catch (error) {
    console.error("Error sending buttons:", error.response?.data || error.message);
  }
}

// ✅ 处理按钮点击（客户点击 Card 1/2/3）
async function handleTransaction({ callback_query }) {
  const chatId = callback_query?.message?.chat?.id;
  const data = callback_query?.data;

  if (!chatId || !data) return;

  await sendMessage(chatId, `You chose *${data.replace("card_", "Card ")}*. Please wait while I reveal your card...`);

  // 后续将由外部模块根据 data 和 userId 生成塔罗牌内容（在 index.js 触发 getCard）
}

module.exports = {
  sendMessage,
  sendPhoto,
  sendCardButtons,
  handleTransaction
};
