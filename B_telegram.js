// B_telegram.js - v1.5.6

const axios = require("axios");
const { getSession, startSession, getCard, isSessionComplete } = require("./G_tarot-session");
const { getCardMeaning } = require("./G_tarot-engine");
const { renderCardButtons } = require("./G_button-render");
const { getSpiritGuide } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");

const { renderPremiumButtons, getNextPremiumGroupIndex } = require("./G_premium-buttons");

const premiumHandlers = {
  premium_summary: require("./G_tarot-summary").getTarotSummary,
  premium_journal: require("./G_journal-prompt").getJournalPrompt,
  premium_shadow: require("./G_shadow-message").getShadowMessage,
  premium_archetype: require("./G_soul-archetype").getSoulArchetype,
  premium_higher: require("./G_higher-self").getHigherSelf,
  premium_cosmic: require("./G_cosmic-alignment").getCosmicAlignment,
  premium_oracle: require("./G_oracle-card").getOracleCard,
  premium_pastlife: require("./G_pastlife").getPastLifeEcho,
  premium_purpose: require("./G_soul-purpose").getSoulPurpose,
  premium_karma: require("./G_karmic-cycle").getKarmicCycle,
  premium_energy: require("./G_energy-reading").getEnergyReading,
  premium_timing: require("./G_divine-timing").getDivineTiming,
  premium_symbol: require("./G_sacred-symbol").getSacredSymbol,
  premium_spirit: require("./G_spirit-message").getMessageFromSpirit,
  premium_mirror: require("./G_mirror-message").getMirrorMessage,
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

        if (session.drawn.length < 3) {
          await axios.post(`${API_URL}/editMessageReplyMarkup`, {
            chat_id: chatId,
            message_id: messageId,
            reply_markup: renderCardButtons(session).reply_markup,
          });
        } else {
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
