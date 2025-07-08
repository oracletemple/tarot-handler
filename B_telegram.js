// B_telegram.js - v1.5.0

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
const { getShadowMessage } = require("./G_shadow-message");
const { getSoulArchetype } = require("./G_soul-archetype");
const { getHigherSelfMessage } = require("./G_higher-self");
const { getCosmicAlignment } = require("./G_cosmic-alignment");
const { getOracleCard } = require("./G_oracle-card");
const { getPastLifeEcho } = require("./G_pastlife");
const { getSoulPurpose } = require("./G_soul-purpose");
const { getKarmicCycle } = require("./G_karma");
const { getEnergyReading } = require("./G_energy-reading");
const { getDivineTiming } = require("./G_divine-timing");
const { getSacredSymbol } = require("./G_sacred-symbol");
const { getSpiritMessage } = require("./G_spirit-message");
const { getMirrorMessage } = require("./G_mirror-message");

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
    const session = getSession(userId);
    if (!session) return;

    // ✅ 分页按钮处理
    const pageMatch = data.match(/^premium_page_(\d+)$/);
    if (pageMatch) {
      const page = parseInt(pageMatch[1]);
      await axios.post(`${API_URL}/editMessageReplyMarkup`, {
        chat_id: callback.message.chat.id,
        message_id: callback.message.message_id,
        reply_markup: renderPremiumButtons(session, page),
      });
      await axios.post(`${API_URL}/answerCallbackQuery`, {
        callback_query_id: callback.id,
      });
      return;
    }

    // ✅ 高端按钮点击处理
    if (data.startsWith("premium_")) {
      const key = data.replace("premium_", "");
      if (isPremiumUsed(userId, key)) return;

      markPremiumUsed(userId, key);

      let msg = "";
      if (key === "gpt") msg = await getGptAnalysis();
      else if (key === "summary") msg = getTarotSummary();
      else if (key === "journal") msg = getJournalPrompt();
      else if (key === "shadow") msg = getShadowMessage();
      else if (key === "archetype") msg = getSoulArchetype();
      else if (key === "higher") msg = getHigherSelfMessage();
      else if (key === "cosmic") msg = getCosmicAlignment();
      else if (key === "oracle") msg = getOracleCard();
      else if (key === "pastlife") msg = getPastLifeEcho(userId);
      else if (key === "purpose") msg = await getSoulPurpose(userId);
      else if (key === "karma") msg = await getKarmicCycle(userId);
      else if (key === "energy") msg = await getEnergyReading(userId);
      else if (key === "timing") msg = await getDivineTiming(userId);
      else if (key === "symbol") msg = await getSacredSymbol(userId);
      else if (key === "spirit") msg = await getSpiritMessage(userId);
      else if (key === "mirror") msg = await getMirrorMessage(userId);

      if (msg) await sendMessage(userId, msg);

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

    // ✅ 抽牌逻辑
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
