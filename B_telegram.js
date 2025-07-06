// B_telegram.js - v1.2.4

const axios = require("axios");
const { startSession, getCard, isSessionComplete, endSession } = require("./G_tarot-session");
const { renderCardMessage } = require("./G_tarot-engine");
const { sendText, sendButtons, sendImage } = require("./G_send-message");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const RECEIVER_ID = parseInt(process.env.RECEIVER_ID);

/**
 * 处理 Telegram Webhook 更新
 * @param {Object} update 
 */
async function handleTelegramUpdate(update) {
  if (update.message) {
    const message = update.message;
    const userId = message.from.id;
    const text = message.text;

    if (text === "/test123" && userId === RECEIVER_ID) {
      await startSession(userId);
      await sendButtons(userId, "🧙 *Your divine reading begins...*\nPlease choose your card:", [
        [
          { text: "🃏 Card 1", callback_data: "card_0" },
          { text: "🃏 Card 2", callback_data: "card_1" },
          { text: "🃏 Card 3", callback_data: "card_2" }
        ]
      ]);
      return;
    }

    // 非测试命令可忽略
  }

  if (update.callback_query) {
    const query = update.callback_query;
    const userId = query.from.id;
    const data = query.data;
    const messageId = query.message.message_id;
    const chatId = query.message.chat.id;

    if (!data.startsWith("card_")) return;

    const index = parseInt(data.split("_")[1]);

    const card = getCard(userId, index);
    if (!card) {
      await answerCallback(query.id, "⚠️ Session not found or card already drawn.");
      return;
    }

    const caption = renderCardMessage(card, index);

    if (card.image) {
      await sendImage(chatId, card.image, caption);
    } else {
      await sendText(chatId, caption);
    }

    if (isSessionComplete(userId)) {
      await endSession(userId);
      await editMessageReplyMarkup(chatId, messageId, { inline_keyboard: [] });
    } else {
      await answerCallback(query.id, "✅ Card received.");
    }
  }
}

/**
 * 回应按钮点击（防止超时 loading）
 * @param {string} callbackQueryId 
 * @param {string} text 
 */
async function answerCallback(callbackQueryId, text) {
  try {
    await axios.post(`${API_URL}/answerCallbackQuery`, {
      callback_query_id: callbackQueryId,
      text
    });
  } catch (err) {
    console.error("❌ answerCallback error:", err.response?.data || err.message);
  }
}

/**
 * 清除按钮（占卜完成后）
 * @param {number} chatId 
 * @param {number} messageId 
 * @param {object} markup 
 */
async function editMessageReplyMarkup(chatId, messageId, markup) {
  try {
    await axios.post(`${API_URL}/editMessageReplyMarkup`, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: markup
    });
  } catch (err) {
    console.error("❌ editMessageReplyMarkup error:", err.response?.data || err.message);
  }
}

module.exports = {
  handleTelegramUpdate
};
