// B_telegram.js - v1.2.8

const axios = require("axios");
const { getSession, startSession } = require("./G_tarot-session");
const { getCard } = require("./G_tarot-session");
const { getCardMeaning } = require("./G_tarot-engine");
const { renderCardButtons } = require("./G_button-render");
const { getSpiritGuide } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text, options = {}) {
  await axios.post(`${API_URL}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
    ...options,
  });
}

async function handleTelegramUpdate(update) {
  const message = update.message;
  const callback = update.callback_query;

  if (message) {
    const userId = message.from.id;
    const text = message.text?.trim();

    // ✅ 测试模式：模拟客户付款流程（推送按钮）
    if (userId === 7685088782) {
      if (text === "/test123") {
        startSession(userId, 12);
        const buttons = renderCardButtons(userId);
        await sendMessage(userId, "🔮 *Test Mode (12 USDT)*\nPlease select a card:", {
          reply_markup: { inline_keyboard: buttons }
        });
        return;
      }

      if (text === "/test30") {
        startSession(userId, 30);
        const buttons = renderCardButtons(userId);
        await sendMessage(userId, "🔮 *Test Mode (30 USDT)*\nPlease select a card:", {
          reply_markup: { inline_keyboard: buttons }
        });
        return;
      }
    }

    return;
  }

  if (callback) {
    const userId = callback.from.id;
    const data = callback.data;

    const match = data.match(/^draw_card_(\d+)_(\d+)/);
    if (!match) return;

    const index = parseInt(match[1]);
    const amount = parseInt(match[2]);

    try {
      const card = getCard(userId, index);
      const meaning = getCardMeaning(card, index);

      // ✅ 替换按钮（保留未抽卡）
      await axios.post(`${API_URL}/editMessageReplyMarkup`, {
        chat_id: callback.message.chat.id,
        message_id: callback.message.message_id,
        reply_markup: {
          inline_keyboard: renderCardButtons(userId),
        },
      });

      await sendMessage(userId, meaning);

      // ✅ 所有卡抽完后自动推送灵性模块
      const session = getSession(userId);
      if (session.drawn.length === 3) {
        await sendMessage(userId, getSpiritGuide());
        await sendMessage(userId, getLuckyHints());
        await sendMessage(userId, getMoonAdvice());
      }
    } catch (err) {
      await sendMessage(userId, `⚠️ ${err.message}`);
    }
  }
}

module.exports = { handleTelegramUpdate };
