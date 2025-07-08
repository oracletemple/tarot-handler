// B_telegram.js - v1.3.1

const axios = require("axios");
const { getSession, startSession } = require("./G_tarot-session");
const { getCard } = require("./G_tarot-session");
const { getCardMeaning } = require("./G_tarot-engine");
const { renderCardButtons } = require("./G_button-render");
const { getSpiritGuide } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");
const { renderPremiumButtons } = require("./G_premium-buttons");
const { markPremiumUsed, isPremiumUsed } = require("./G_premium-session");

const { getGptAnalysis } = require("./G_gpt-analysis");
const { getTarotSummary } = require("./G_tarot-summary");
const { getJournalPrompt } = require("./G_journal-prompt");

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

    if (userId === 7685088782) {
      if (text === "/test123") {
        startSession(userId, 12);
        await sendMessage(userId, "✅ Test mode activated (12 USDT). Please choose your card:");
        await sendMessage(userId, "Please draw your cards:", {
          reply_markup: renderCardButtons(userId),
        });
        return;
      }

      if (text === "/test30") {
        startSession(userId, 30);
        await sendMessage(userId, "✅ Test mode activated (30 USDT). Please choose your card:");
        await sendMessage(userId, "Please draw your cards:", {
          reply_markup: renderCardButtons(userId),
        });
        return;
      }
    }

    return;
  }

  if (callback) {
    const userId = callback.from.id;
    const data = callback.data;

    // 高端服务按钮处理
    if (data.startsWith("premium_")) {
      const key = data.replace("premium_", "");
      const session = getSession(userId);
      if (!session) return;

      if (isPremiumUsed(userId, key)) return;
      markPremiumUsed(userId, key);

      if (key === "gpt") {
        const msg = await getGptAnalysis();
        await sendMessage(userId, msg);
      }

      if (key === "summary") {
        const msg = getTarotSummary();
        await sendMessage(userId, msg);
      }

      if (key === "journal") {
        const msg = getJournalPrompt();
        await sendMessage(userId, msg);
      }

      await axios.post(`${API_URL}/editMessageReplyMarkup`, {
        chat_id: callback.message.chat.id,
        message_id: callback.message.message_id,
        reply_markup: renderPremiumButtons(session),
      });

      await axios.post(`${API_URL}/answerCallbackQuery`, {
        callback_query_id: callback.id,
      });

      return;
    }

    // 抽牌逻辑
    const match = data.match(/^draw_card_(\d+)_(\d+)/);
    if (!match) return;

    const index = parseInt(match[1]);
    const amount = parseInt(match[2]);

    try {
      const card = getCard(userId, index);
      const meaning = getCardMeaning(card, index);

      await axios.post(`${API_URL}/editMessageReplyMarkup`, {
        chat_id: callback.message.chat.id,
        message_id: callback.message.message_id,
        reply_markup: renderCardButtons(userId),
      });

      await sendMessage(userId, meaning);

      const session = getSession(userId);
      if (session.drawn.length === 3) {
        await sendMessage(userId, getSpiritGuide());
        await sendMessage(userId, getLuckyHints());
        await sendMessage(userId, getMoonAdvice());

        await sendMessage(userId, "✨ *Unlock your deeper guidance:*", {
          reply_markup: renderPremiumButtons(session),
        });
      }
    } catch (err) {
      await sendMessage(userId, `⚠️ ${err.message}`);
    }
  }
}

module.exports = { handleTelegramUpdate };
