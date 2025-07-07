// B_telegram.js - v1.2.6

const axios = require("axios");
const { getSession, getCard, isSessionComplete } = require("./G_tarot-session");
const { getRemainingButtons } = require("./G_button-render");

const TOKEN = process.env.BOT_TOKEN;
const API = `https://api.telegram.org/bot${TOKEN}`;

async function handleTelegramUpdate(update) {
  if (update.message) {
    const message = update.message;
    const userId = message.from.id;
    const text = message.text;

    if (text === "/test123" && userId === 7685088782) {
      const simulate = require("./G_simulate-click");
      await simulate.simulateButtonClick(userId, 1, 12);
      await simulate.simulateButtonClick(userId, 2, 12);
    }

    return;
  }

  if (update.callback_query) {
    const query = update.callback_query;
    const userId = query.from.id;
    const data = query.data;
    const msg = query.message;

    // 1. 删除按钮
    await axios.post(`${API}/editMessageReplyMarkup`, {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
      reply_markup: null
    });

    if (!data.startsWith("card_")) return;

    const index = parseInt(data.split("_")[1]);
    if (isNaN(index)) return;

    try {
      const card = getCard(userId, index);

      const caption = `✨ You drew *${card.name}*\n\n_${card.meaning}_`;
      await axios.post(`${API}/sendMessage`, {
        chat_id: userId,
        text: caption,
        parse_mode: "Markdown"
      });

      const session = getSession(userId);
      if (!session) return;

      const remainingButtons = getRemainingButtons(session.drawn);
      if (remainingButtons) {
        await axios.post(`${API}/sendMessage`, {
          chat_id: userId,
          text: "🔮 Choose your next card:",
          reply_markup: { inline_keyboard: remainingButtons }
        });
      }
    } catch (err) {
      await axios.post(`${API}/sendMessage`, {
        chat_id: userId,
        text: `⚠️ ${err.message || "Unknown error"}`
      });
    }
  }
}

module.exports = { handleTelegramUpdate };
