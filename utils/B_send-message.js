// B_send-message.js // v1.1.0

const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendTextMessage(chatId, text) {
  try {
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "Markdown"
    });
  } catch (error) {
    console.error("❌ Failed to send text message:", error.response?.data || error.message);
  }
}

async function sendCardButtons(chatId) {
  try {
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: chatId,
      text: "Your spiritual reading is ready. Please choose a card to reveal:",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🃏 Card 1", callback_data: "card_1_12" },
            { text: "🃏 Card 2", callback_data: "card_2_12" },
            { text: "🃏 Card 3", callback_data: "card_3_12" }
          ]
        ]
      }
    });
  } catch (error) {
    console.error("❌ Failed to send card buttons:", error.response?.data || error.message);
  }
}

async function editMessage(chatId, messageId, newText) {
  try {
    await axios.post(`${API_URL}/editMessageText`, {
      chat_id: chatId,
      message_id: messageId,
      text: newText,
      parse_mode: "Markdown"
    });
  } catch (error) {
    console.error("❌ Failed to edit message:", error.response?.data || error.message);
  }
}

module.exports = {
  sendTextMessage,
  sendCardButtons,
  editMessage
};
