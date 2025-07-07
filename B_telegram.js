// B_telegram.js - v1.2.5

const { getSession, startSession, getCard, isSessionComplete } = require("./G_tarot-session");
const { renderCardButtons } = require("./G_button-render");
const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function handleTelegramUpdate(update) {
  if (update.message && update.message.text === "/test123") {
    const userId = update.message.from.id;
    startSession(userId, 12);
    await sendInitialButtons(userId);
    return;
  }

  if (update.callback_query) {
    const { from, message, data, id } = update.callback_query;
    const userId = from.id;

    if (!data.startsWith("card_")) return;

    const parts = data.split("_");
    const cardIndex = parseInt(parts[1]);
    const amount = parseInt(parts[2]);

    const session = getSession(userId) || startSession(userId, amount);

    let card;
    try {
      card = getCard(userId, cardIndex);
    } catch (err) {
      console.warn("⚠️", err.message);
      return;
    }

    const meaning = card.meaning || "This card brings insight.";
    const text = `🔮 You drew: *${card.name}*\n_${meaning}_`;

    const replyMarkup = renderCardButtons(session);

    await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
      chat_id: message.chat.id,
      message_id: message.message_id,
      reply_markup: replyMarkup || { inline_keyboard: [] }
    });

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: message.chat.id,
      text,
      parse_mode: "Markdown"
    });

    if (isSessionComplete(userId)) {
      // ✅ 三张抽完后推送附加内容（暂为占位）
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: message.chat.id,
        text: "🧚 *Your divine guide will now appear...*\n(Guardian Spirit, Lucky Color & Moon Advice will follow)",
        parse_mode: "Markdown"
      });

      // TODO: 接入自动推送模块
      // require('./G_guardian-spirit').send(userId)
      // require('./G_lucky-color').send(userId)
      // require('./G_moon-energy').send(userId)
    }
  }
}

async function sendInitialButtons(userId) {
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: userId,
    text: "🧙 Your divine reading begins...\nPlease choose your card:",
    reply_markup: {
      inline_keyboard: [[
        { text: "🃏 Card 1", callback_data: "card_0_12" },
        { text: "🃏 Card 2", callback_data: "card_1_12" },
        { text: "🃏 Card 3", callback_data: "card_2_12" }
      ]]
    }
  });
}

module.exports = { handleTelegramUpdate };
