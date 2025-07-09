// B_telegram.js - v1.5.5

const axios = require("axios");
const { getSession, startSession } = require("./G_tarot-session");
const { getCardMeaning } = require("./G_tarot-engine");
const { renderCardButtons } = require("./G_button-render");
const { getSpiritGuide } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");
const { renderPremiumButtons } = require("./G_premium-buttons");

// 所有高级功能模块引入
const { getGptAnalysis } = require("./G_gpt-analysis");
const { getTarotSummary } = require("./G_tarot-summary");
const { getJournalPrompt } = require("./G_journal-prompt");
const { getPastLife } = require("./G_pastlife");
const { getSoulPurpose } = require("./G_soul-purpose");
const { getKarmicCycle } = require("./G_karmic-cycle");
const { getEnergyReading } = require("./G_energy-reading");
const { getDivineTiming } = require("./G_divine-timing");
const { getSacredSymbol } = require("./G_sacred-symbol");
const { getSpiritMessage } = require("./G_spirit-message");
const { getMirrorMessage } = require("./G_mirror-message");
const { getOracleCard } = require("./G_oracle-card");
const { getHigherSelf } = require("./G_higher-self");

// Premium handler 映射
const premiumHandlers = {
  premium_gpt: getGptAnalysis,
  premium_summary: getTarotSummary,
  premium_journal: getJournalPrompt,
  premium_pastlife: getPastLife,
  premium_purpose: getSoulPurpose,
  premium_karma: getKarmicCycle,
  premium_energy: getEnergyReading,
  premium_timing: getDivineTiming,
  premium_symbol: getSacredSymbol,
  premium_spirit: getSpiritMessage,
  premium_mirror: getMirrorMessage,
  premium_oracle: getOracleCard,
  premium_higher: getHigherSelf
};

// 发消息函数
async function sendTelegramMessage(chatId, text, options = {}) {
  try {
    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      ...options
    });
  } catch (err) {
    console.error("❌ Failed to send message:", err.response?.data || err.message);
  }
}

// 主入口
async function handleTelegramUpdate(update) {
  const message = update.message;
  const callback = update.callback_query;

  if (message && message.text?.startsWith("/test")) {
    const userId = message.from.id;
    const amount = message.text.includes("30") ? 30 : 12;
    startSession(userId, amount);
    await sendTelegramMessage(userId, "🃏 Please draw your cards:", renderCardButtons(userId));
    return;
  }

  if (callback) {
    const userId = callback.from.id;
    const data = callback.data;
    const session = getSession(userId);
    if (!session) return;

    const messageId = callback.message.message_id;
    const chatId = callback.message.chat.id;

    // 处理抽牌按钮
    if (data.startsWith("card_")) {
      const cardIndex = parseInt(data.split("_")[1]);
      const card = session.cards[cardIndex];
      if (!card) return;

      const meaning = getCardMeaning(card, cardIndex);
      await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/editMessageText`, {
        chat_id: chatId,
        message_id: messageId,
        text: meaning,
        parse_mode: "Markdown",
        reply_markup: renderCardButtons(userId).reply_markup
      });

      // 如果抽完 3 张自动推送基础功能
      if (session.drawn.length === 3) {
        await sendTelegramMessage(chatId, await getSpiritGuide());
        await sendTelegramMessage(chatId, await getLuckyHints());
        await sendTelegramMessage(chatId, await getMoonAdvice());
        await sendTelegramMessage(chatId, "✨ Choose your premium guidance:", renderPremiumButtons());
      }
      return;
    }

    // 处理高级按钮点击
    if (premiumHandlers[data]) {
      const handler = premiumHandlers[data];
      await sendTelegramMessage(chatId, "⏳ Receiving divine insight...");
      const result = await handler(userId);
      await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/editMessageReplyMarkup`, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: { inline_keyboard: [] }
      });
      await sendTelegramMessage(chatId, result);
    }
  }
}

module.exports = {
  handleTelegramUpdate
};
