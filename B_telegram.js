// B_telegram.js - v1.5.5

const axios = require("axios");
const { getSession, startSession, getCard, isSessionComplete } = require("./G_tarot-session");
const { getCardMeaning } = require("./G_tarot-engine");
const { renderCardButtons } = require("./G_button-render"); // ✅ 已切换为新版渲染器
const { getSpiritGuide } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");
const { renderPremiumButtonsInline, premiumHandlers } = require("./G_premium-buttons");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function handleTelegramUpdate(update) {
  const message = update.message;
  const callback = update.callback_query;

  if (message) {
    const chatId = message.chat.id;
    const text = message.text;

    if (text === "/test123" && chatId == process.env.RECEIVER_ID) {
      startSession(chatId, 12);
      const session = getSession(chatId);
      await sendMessage(chatId, "🃏 Please draw your cards:", renderCardButtons(session));
    }

    if (text === "/test30" && chatId == process.env.RECEIVER_ID) {
      startSession(chatId, 30);
      const session = getSession(chatId);
      await sendMessage(chatId, "🃏 Please draw your cards:", renderCardButtons(session));
    }
  }

  if (callback) {
    const userId = callback.from.id;
    const data = callback.data;
    const msgId = callback.message.message_id;

    if (data.startsWith("card_")) {
      const index = parseInt(data.split("_")[1]);
      try {
        const card = getCard(userId, index);
        const meaning = getCardMeaning(card, index);
        await sendMessage(userId, meaning);

        const session = getSession(userId);
        if (!isSessionComplete(userId)) {
          await updateMessageButtons(userId, msgId, renderCardButtons(session));
        } else {
          await updateMessageButtons(userId, msgId, { inline_keyboard: [] });
          await sendMessage(userId, await getSpiritGuide());
          await sendMessage(userId, await getLuckyHints());
          await sendMessage(userId, await getMoonAdvice());
          await sendMessage(userId, "✨ Unlock your deeper guidance:", renderPremiumButtonsInline());
        }
      } catch (err) {
        await sendMessage(userId, `⚠️ ${err.message}`);
      }
    }

    if (premiumHandlers[data]) {
      const response = await premiumHandlers[data](userId);
      await sendMessage(userId, response);
    }
  }
}

async function sendMessage(chatId, text, reply_markup = null) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
  };
  if (reply_markup) payload.reply_markup = reply_markup;

  try {
    await axios.post(`${API_URL}/sendMessage`, payload);
  } catch (err) {
    console.error("Telegram sendMessage error:", err.response?.data || err.message);
  }
}

async function updateMessageButtons(chatId, messageId, reply_markup) {
  try {
    await axios.post(`${API_URL}/editMessageReplyMarkup`, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup,
    });
  } catch (err) {
    console.error("Telegram update buttons error:", err.response?.data || err.message);
  }
}

module.exports = { handleTelegramUpdate };
