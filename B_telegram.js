// B_telegram.js - v1.5.4

const axios = require("axios");
const { getSession, getCard, isSessionComplete } = require("./G_tarot-session");
const { getCardMeaning } = require("./G_tarot-engine");
const { renderCardButtons } = require("./G_button-render");
const { getSpiritGuide } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");
const { getPremiumHandler } = require("./G_premium-buttons");

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text, extra = {}) {
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
    ...extra
  });
}

async function editMessage(chatId, messageId, text, extra = {}) {
  await axios.post(`${TELEGRAM_API}/editMessageText`, {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "Markdown",
    ...extra
  });
}

async function handleTelegramUpdate(update) {
  if (update.message && update.message.text) {
    const message = update.message;
    const userId = message.from.id;
    const text = message.text;

    if (text === "/test123") {
      const session = require("./G_tarot-session").startSession(userId, 12);
      await sendMessage(userId, "🃏 Please draw your cards:", renderCardButtons(session));
    }

    if (text === "/test30") {
      const session = require("./G_tarot-session").startSession(userId, 30);
      await sendMessage(userId, "🃏 Please draw your cards:", renderCardButtons(session));
    }
  }

  if (update.callback_query) {
    const query = update.callback_query;
    const userId = query.from.id;
    const messageId = query.message.message_id;
    const data = query.data;
    const session = getSession(userId);

    // === Tarot Card Logic ===
    if (data.startsWith("card_")) {
      if (!session) return sendMessage(userId, "⚠️ Session not found. Please try again later.");

      const index = parseInt(data.split("_")[1]);
      const card = getCard(userId, index);
      const meaning = getCardMeaning(card, index);
      await editMessage(userId, messageId, meaning, renderCardButtons(session));

      if (isSessionComplete(userId)) {
        await sendMessage(userId, await getSpiritGuide());
        await sendMessage(userId, await getLuckyHints());
        await sendMessage(userId, await getMoonAdvice());

        if (session.amount >= 30) {
          await sendMessage(userId, "✨ Unlock your deeper guidance:", getPremiumHandler(userId, 0));
        }
      }
      return;
    }

    // === Premium Button Logic ===
    if (data.startsWith("premium_")) {
      const handler = getPremiumHandler(userId);
      if (typeof handler[data] !== "function") return;

      // Replace button with loading message
      await editMessage(userId, messageId, "⏳ Receiving divine insight...");

      // Then send premium content
      const text = await handler[data](userId);
      await sendMessage(userId, text);
      return;
    }

    // === Button Pagination ===
    if (data.startsWith("next_")) {
      const groupIndex = parseInt(data.split("_")[1]);
      await editMessage(userId, messageId, "✨ Unlock your deeper guidance:", getPremiumHandler(userId, groupIndex));
      return;
    }
  }
}

module.exports = {
  handleTelegramUpdate
};
