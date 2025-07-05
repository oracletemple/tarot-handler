// v1.1.5 - telegram.js
const axios = require("axios");
const BOT_TOKEN = process.env.BOT_TOKEN;
const RECEIVER_ID = process.env.RECEIVER_ID;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

const { getCard, isSessionComplete, startSession, clearSession } = require("./tarot-session");

// ✅ 按钮数组（每次都创建新副本）
function getCardButtons() {
  return {
    inline_keyboard: [
      [
        { text: "🃏 Card 1", callback_data: "card_1" },
        { text: "🃏 Card 2", callback_data: "card_2" },
        { text: "🃏 Card 3", callback_data: "card_3" },
      ],
    ],
  };
}

// ✅ 推送塔罗牌抽取按钮
async function sendCardButtons(userId) {
  return axios.post(`${API_URL}/sendMessage`, {
    chat_id: userId,
    text: "You have received a divine reading. Please choose your first card:",
    reply_markup: getCardButtons(),
  });
}

// ✅ 处理交易或按钮事件
async function handleTransaction({ callback_query }) {
  const userId = callback_query.from.id;
  const data = callback_query.data;

  const cardIndex = parseInt(data.replace("card_", ""));
  if (isNaN(cardIndex)) return;

  const result = await getCard(userId, cardIndex);
  await axios.post(`${API_URL}/sendMessage`, {
    chat_id: userId,
    text: result.text,
  });

  if (isSessionComplete(userId)) {
    await clearButtons(callback_query.message.message_id, userId);
  }
}

// ✅ 清除按钮（抽完三张牌）
async function clearButtons(messageId, userId) {
  return axios.post(`${API_URL}/editMessageReplyMarkup`, {
    chat_id: userId,
    message_id: messageId,
    reply_markup: { inline_keyboard: [] },
  });
}

module.exports = {
  sendCardButtons,
  handleTransaction,
};
