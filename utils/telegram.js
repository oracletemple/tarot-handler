// telegram.js - v1.2.2
const axios = require("axios");
const { getCard, isSessionComplete, clearSession } = require("./tarot-session");
const { drawTarotCard } = require("./tarot-engine");

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendButtonMessage(userId, text) {
  const buttons = [
    [{ text: "🃏 Card 1", callback_data: "card_0" }],
    [{ text: "🃏 Card 2", callback_data: "card_1" }],
    [{ text: "🃏 Card 3", callback_data: "card_2" }],
  ];

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: userId,
    text,
    reply_markup: {
      inline_keyboard: buttons,
    },
  });
}

async function handleCallbackQuery(callback) {
  const userId = callback.from.id;
  const data = callback.data;

  if (!data || !data.startsWith("card_")) return;

  const index = parseInt(data.split("_")[1]);
  const card = await getCard(userId, index);

  if (!card) {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: userId,
      text: "⚠️ Session not found or card already drawn.",
    });
    return;
  }

  console.log(`🎴 Card ${index} drawn by ${userId}`);

  const interpretation = drawTarotCard(card);

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: userId,
    text: `🃏 **${card.name}**\n_${card.position}_\n\n${interpretation}`,
    parse_mode: "Markdown",
  });

  if (isSessionComplete(userId)) {
    console.log(`✅ Session complete for ${userId}`);
    await clearSession(userId);
  }
}

module.exports = {
  sendButtonMessage,
  handleCallbackQuery,
};
