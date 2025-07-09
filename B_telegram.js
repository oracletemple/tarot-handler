// B_telegram.js - v1.5.5

const axios = require("axios");
const { getSession, startSession, getCard, isSessionComplete } = require("./G_tarot-session");
const { getCardMeaning } = require("./G_tarot-engine");
const { renderCardButtons } = require("./G_button-render");

const { getSpiritGuide } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");

const {
  renderPremiumButtons,
  getNextPremiumGroupIndex,
  getPremiumButtonsByGroup
} = require("./G_premium-buttons");

const {
  getTarotSummary,
  getJournalPrompt,
  getShadowMessage,
  getSoulArchetype,
  getHigherSelf,
  getCosmicAlignment,
  getOracleCard,
  getPastLifeEcho,
  getSoulPurpose,
  getKarmicCycle,
  getEnergyReading,
  getDivineTiming,
  getSacredSymbol,
  getMessageFromSpirit,
  getMirrorMessage,
} = {
  ...require("./G_tarot-summary"),
  ...require("./G_journal-prompt"),
  ...require("./G_shadow-message"),
  ...require("./G_soul-archetype"),
  ...require("./G_higher-self"),
  ...require("./G_cosmic-alignment"),
  ...require("./G_oracle-card"),
  ...require("./G_pastlife"),
  ...require("./G_soul-purpose"),
  ...require("./G_karmic-cycle"),
  ...require("./G_energy-reading"),
  ...require("./G_divine-timing"),
  ...require("./G_sacred-symbol"),
  ...require("./G_spirit-message"),
  ...require("./G_mirror-message"),
};

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text, options = {}) {
  return axios.post(`${API_URL}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
    ...options,
  });
}

async function editMessage(chatId, messageId, text, options = {}) {
  return axios.post(`${API_URL}/editMessageText`, {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "Markdown",
    ...options,
  });
}

async function handleTelegramUpdate(req, res) {
  const body = req.body;

  if (body.message && body.message.text) {
    const chatId = body.message.chat.id;
    const userId = body.message.from.id;
    const text = body.message.text;

    if (text === "/test30" && userId === 7685088782) {
      const session = startSession(userId, 30);
      await sendMessage(chatId, `🃏 Please draw your cards:`, {
        reply_markup: renderCardButtons(session).reply_markup,
      });
    }

    if (text === "/test123" && userId === 7685088782) {
      const session = startSession(userId, 12);
      await sendMessage(chatId, `🃏 Please draw your cards:`, {
        reply_markup: renderCardButtons(session).reply_markup,
      });
    }

    return res.sendStatus(200);
  }

  if (body.callback_query) {
    const callback = body.callback_query;
    const userId = callback.from.id;
    const chatId = callback.message.chat.id;
    const messageId = callback.message.message_id;
    const data = callback.data;

    // ===== 抽卡逻辑 =====
    if (data.startsWith("card_")) {
      const index = parseInt(data.split("_")[1], 10);
      try {
        const session = getSession(userId);
        if (!session) throw new Error("Session not found.");

        const tarotDeck = require("./G_card-data");
        const availableCards = tarotDeck.filter(card => !session.cards.includes(card));
        const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
        session.cards[index] = randomCard;
        session.drawn.push(index);

        const label = ["🌒 Past", "🌕 Present", "🌘 Future"][index] || `Card ${index + 1}`;
        const meaning = getCardMeaning(randomCard.name);
        await editMessage(chatId, messageId, `🔮 *${label}*\n${randomCard.name}\n_${meaning}_`);

        // 更新按钮（隐藏已点击项）
        if (session.drawn.length < 3) {
          await axios.post(`${API_URL}/editMessageReplyMarkup`, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: renderCardButtons(session).reply_markup,
          });
        } else {
          // 推送灵性内容（基础 + 高端按钮）
          await sendMessage(chatId, await getSpiritGuide());
          await sendMessage(chatId, await getLuckyHints());
          await sendMessage(chatId, await getMoonAdvice());
          await renderPremiumButtons(chatId, messageId, 0);
        }
      } catch (err) {
        await sendMessage(chatId, `⚠️ ${err.message || "Error drawing card."}`);
      }

      return res.sendStatus(200);
    }

    // ===== 高端模块回调处理 =====
    const premiumHandlers = {
      premium_summary: getTarotSummary,
      premium_journal: getJournalPrompt,
      premium_shadow: getShadowMessage,
      premium_archetype: getSoulArchetype,
      premium_higher: getHigherSelf,
      premium_cosmic: getCosmicAlignment,
      premium_oracle: getOracleCard,
      premium_pastlife: getPastLifeEcho,
      premium_purpose: getSoulPurpose,
      premium_karma: getKarmicCycle,
      premium_energy: getEnergyReading,
      premium_timing: getDivineTiming,
      premium_symbol: getSacredSymbol,
      premium_spirit: getMessageFromSpirit,
      premium_mirror: getMirrorMessage,
    };

    if (data in premiumHandlers) {
      const session = getSession(userId);
      const content = await premiumHandlers[data](userId, session?.cards);
      await sendMessage(chatId, content);

      const nextGroup = getNextPremiumGroupIndex(data);
      if (nextGroup !== null) {
        await renderPremiumButtons(chatId, messageId, nextGroup);
      }

      return res.sendStatus(200);
    }

    // ===== 下一组按钮分页 =====
    if (data.startsWith("next_")) {
      const groupIndex = parseInt(data.split("_")[1], 10);
      await renderPremiumButtons(chatId, messageId, groupIndex);
      return res.sendStatus(200);
    }

    return res.sendStatus(200);
  }

  res.sendStatus(200);
}

module.exports = {
  handleTelegramUpdate,
};
