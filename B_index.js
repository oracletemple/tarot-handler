// B_telegram.js - v1.2.7

const axios = require("axios");
const { sendMessage, sendCardButtons } = require("./G_send-message");
const { getSession, startSession, getCard, isSessionComplete } = require("./G_tarot-session");
const { getCardMeaning } = require("./G_tarot-engine");
const { renderRemainingButtons } = require("./G_button-render");
const { getSpiritGuide } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");

// 主处理器
async function handleTelegramUpdate(update) {
  if (update.message && update.message.text) {
    const message = update.message;
    const userId = message.from.id;
    const text = message.text;

    if (text === "/start") {
      await sendMessage(userId, "Welcome. Please make a payment to begin your spiritual reading.");
    } else if (text === "/test123" && userId === 7685088782) {
      startSession(userId, 12);
      await sendCardButtons(userId);
    } else if (text === "/test30" && userId === 7685088782) {
      startSession(userId, 30);
      await sendCardButtons(userId);
    }
  }

  if (update.callback_query) {
    const query = update.callback_query;
    const userId = query.from.id;
    const data = query.data;
    const messageId = query.message.message_id;

    if (!data.startsWith("card_")) return;

    const [_, indexStr, amountStr] = data.split("_");
    const index = parseInt(indexStr);
    const amount = parseInt(amountStr);

    let session = getSession(userId);
    if (!session) {
      session = startSession(userId, amount);
    }

    if (session.drawn.includes(index)) {
      await sendMessage(userId, "⚠️ You've already drawn this card.");
      return;
    }

    try {
      const card = getCard(userId, index);
      const meaning = getCardMeaning(card);
      await sendMessage(userId, `*Your ${getPositionLabel(index)} Card:*

${meaning}`);

      if (isSessionComplete(userId)) {
        // 三张牌都抽完，推送灵性模块：守护灵、幸运色与数字、月亮建议
        await sendMessage(userId, await getSpiritGuide());
        await sendMessage(userId, await getLuckyHints());
        await sendMessage(userId, await getMoonAdvice());
      } else {
        await renderRemainingButtons(userId, session);
      }
    } catch (err) {
      await sendMessage(userId, `❌ Error: ${err.message}`);
    }
  }
}

function getPositionLabel(index) {
  return ["Past", "Present", "Future"][index] || "Card";
}

module.exports = { handleTelegramUpdate };
