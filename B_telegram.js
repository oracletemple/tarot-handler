// B_telegram.js - v1.5.10
const axios = require("axios");
const { getSession, startSession, getCard, isSessionComplete } = require("./G_tarot-session");
const { getCardMeaning } = require("./G_tarot-engine");
const { renderCardButtons } = require("./G_button-render");
const { getSpiritGuide } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");
const { renderPremiumButtonsInline, premiumHandlers, removeClickedButton } = require("./G_premium-buttons");
const { startFlow, incrementDraw, markStep, markPremiumClick, debugFlow } = require("./G_flow-monitor");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function answerCallbackQuery(callbackQueryId, text, alert = false) {
  await axios.post(`${API_URL}/answerCallbackQuery`, {
    callback_query_id: callbackQueryId,
    text,
    show_alert: alert
  });
}

function escapeMarkdown(text) {
  return text.replace(/[_*\[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

async function handleTelegramUpdate(update) {
  console.log("\n📥 Received Webhook Payload:", JSON.stringify(update, null, 2));

  const message = update.message;
  const callback = update.callback_query;

  if (message) {
    const chatId = message.chat.id;
    const text = message.text;

    if ((text === "/test123" || text === "/test12") && chatId == process.env.RECEIVER_ID) {
      const session = startSession(chatId, 12);
      startFlow(chatId);
      console.log("✅ /test123 or /test12 triggered, session started:", session);
      await sendMessage(chatId, "🃏 Please draw your cards:", renderCardButtons(session));
    }

    if (text === "/test30" && chatId == process.env.RECEIVER_ID) {
      const session = startSession(chatId, 30);
      startFlow(chatId);
      console.log("✅ /test30 triggered, session started:", session);
      await sendMessage(chatId, "🃏 Please draw your cards:", renderCardButtons(session));
    }

    if (text === "/debugflow" && chatId == process.env.RECEIVER_ID) {
      const status = debugFlow(chatId);
      await sendMessage(chatId, status);
    }
  }

  if (callback) {
    const userId = callback.from.id;
    const data = callback.data;
    const msgId = callback.message.message_id;

    const session = getSession(userId);
    // === 基础版访问高级模块 ===
    if (premiumHandlers[data] && session.amount < 30) {
      await answerCallbackQuery(callback.id, 'Unlock advanced modules by paying the remaining ' + (30 - session.amount) + ' USDT.', true);
      await sendMessage(userId,
        'To access premium guidance, please complete your payment:',
        { inline_keyboard: [[{ text: `Pay ${30 - session.amount} USDT Now`, url: 'https://divinepay.onrender.com/' }]] }
      );
      return;
    }

    // === 基础卡牌互动 ===
    if (data.startsWith("card_")) {
      const index = parseInt(data.split("_")[1]);
      try {
        const card = getCard(userId, index);
        const meaning = getCardMeaning(card, index);

        await sendMessage(userId, meaning);
        incrementDraw(userId);

        if (!isSessionComplete(userId)) {
          await updateMessageButtons(userId, msgId, renderCardButtons(session));
        } else {
          await updateMessageButtons(userId, msgId, { inline_keyboard: [] });

          const guide = await getSpiritGuide();
          await sendMessage(userId, guide);
          markStep(userId, "spiritGuide");

          const hints = await getLuckyHints();
          await sendMessage(userId, hints);
          markStep(userId, "luckyHints");

          const moon = await getMoonAdvice();
          await sendMessage(userId, moon);
          markStep(userId, "moonAdvice");

          await sendMessage(userId, "✨ Unlock your deeper guidance:", renderPremiumButtonsInline());
          markStep(userId, "premiumButtonsShown");
        }
      } catch (err) {
        await sendMessage(userId, `⚠️ ${err.message}`);
      }
      return;
    }

    // === 高端灵性模块按钮点击 ===
    if (premiumHandlers[data] && session.amount >= 30) {
      // 防止重复点击
      session._premiumHandled = session._premiumHandled || new Set();
      if (session._premiumHandled.has(data)) {
        return;
      }
      session._premiumHandled.add(data);

      await answerCallbackQuery(callback.id, 'Loading content...', false);
      // 立即移除按钮
      const removedMarkup = removeClickedButton(callback.message.reply_markup, data);
      await updateMessageButtons(userId, msgId, removedMarkup);

      try {
        const response = await premiumHandlers[data](userId);
        markPremiumClick(userId, data);
        await sendMessage(userId, response);
      } catch (err) {
        console.error("❌ Premium handler error:", err);
        await sendMessage(userId, `⚠️ Failed to load: ${data}`);
      }
      return;
    }
  }
}

async function sendMessage(chatId, text, reply_markup = null) {
  const payload = {
    chat_id: chatId,
    text: escapeMarkdown(text),
    parse_mode: "MarkdownV2"
  };
  if (reply_markup) payload.reply_markup = reply_markup;

  try {
    const res = await axios.post(`${API_URL}/sendMessage`, payload);
    console.log("✅ Message sent to Telegram:", JSON.stringify(payload, null, 2));
    return res;
  } catch (err) {
    console.error("Telegram sendMessage error:", err.response?.data || err.message);
  }
}

async function updateMessageButtons(chatId, messageId, reply_markup) {
  try {
    await axios.post(`${API_URL}/editMessageReplyMarkup`, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup
    });
  } catch (err) {
    console.error("Telegram update buttons error:", err.response?.data || err.message);
  }
}

module.exports = { handleTelegramUpdate };

