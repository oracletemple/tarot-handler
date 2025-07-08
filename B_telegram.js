// B_telegram.js - v1.2.6

const axios = require("axios");

const { getSession, getCard, isSessionComplete } = require("./G_tarot-session");
const { renderCardButtons } = require("./G_button-render");
const { generateSpiritualGuidance } = require("./G_spirit-guide");
const { generateLuckyHints } = require("./G_lucky-hints");
const { generateMoonAdvice } = require("./G_moon-advice");

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

async function handleTelegramUpdate(update) {
  if (update.callback_query) {
    const { data, from, message } = update.callback_query;
    const userId = from.id;
    const messageId = message.message_id;

    const [prefix, indexStr] = data.split("_");
    const cardIndex = parseInt(indexStr, 10);

    const session = getSession(userId);
    if (!session) {
      return sendMessage(userId, "⚠️ Session not found. Please try again later.");
    }

    try {
      const card = getCard(userId, cardIndex);
      const cardPosition = ["Past", "Present", "Future"][cardIndex] || "Card";

      const caption = `🔮 *${cardPosition}*\n${card.name}\n_${card.meaning}_`;
      await sendMessage(userId, caption, "Markdown");

      // ✅ 删除旧按钮，重发未抽部分
      const newButtons = renderCardButtons(session);
      await editButtons(userId, messageId, "Please select a card:", newButtons);

      // ✅ 所有牌抽完后，发送附加灵性模块
      if (isSessionComplete(userId)) {
        const spiritualText = generateSpiritualGuidance();
        const luckyText = generateLuckyHints();
        const moonText = generateMoonAdvice();

        await sendMessage(userId, `🧚 *Your Spirit Guide*\n${spiritualText}`, "Markdown");
        await sendMessage(userId, `🎨 *Lucky Color & Number*\n${luckyText}`, "Markdown");
        await sendMessage(userId, `🌕 *Moon Energy Advice*\n${moonText}`, "Markdown");
      }
    } catch (err) {
      console.error("❌ handleTelegramUpdate callback error:", err);
      await sendMessage(userId, "⚠️ An error occurred while drawing the card.");
    }
  }

  // ✅ /test123 测试命令（可略过处理，或加欢迎）
  if (update.message && update.message.text === "/test123") {
    return sendMessage(update.message.chat.id, "✅ Test mode activated.");
  }
}

async function sendMessage(chatId, text, parseMode = null) {
  const payload = {
    chat_id: chatId,
    text,
  };
  if (parseMode) payload.parse_mode = parseMode;

  await axios.post(`${TELEGRAM_API}/sendMessage`, payload);
}

async function editButtons(chatId, messageId, text, buttons) {
  await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: {
      inline_keyboard: buttons,
    },
  });
}

module.exports = {
  handleTelegramUpdate,
};
