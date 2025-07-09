const axios = require("axios");
const { getSession, startSession, getCard, isSessionComplete } = require("./G_tarot-session");
const { getCardMeaning } = require("./G_tarot-engine");
const { renderCardButtons } = require("./G_button-render");
const { getSpiritGuide } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");
const { renderPremiumButtonsInline, premiumHandlers } = require("./G_premium-buttons");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function handleTelegramUpdate(update) {
  console.log("\n📥 Received Webhook Payload:", JSON.stringify(update, null, 2));

  const message = update.message;
  const callback = update.callback_query;

  if (message) {
    const chatId = message.chat.id;
    const text = message.text;

    if ((text === "/test123" || text === "/test12") && chatId == process.env.RECEIVER_ID) {
      const session = startSession(chatId, 12);
      console.log("✅ /test123 or /test12 triggered, session started:", session);
      await sendMessage(chatId, "🃏 Please draw your cards:", renderCardButtons(session));
    }

    if (text === "/test30" && chatId == process.env.RECEIVER_ID) {
      const session = startSession(chatId, 30);
      console.log("✅ /test30 triggered, session started:", session);
      await sendMessage(chatId, "🃏 Please draw your cards:", renderCardButtons(session));
    }
  }

  if (callback) {
    const userId = callback.from.id;
    const data = callback.data;
    const msgId = callback.message.message_id;

    if (data.startsWith("card_")) {
      const index = parseInt(data.split("_")[1]);
      try {
        const card = getCard(userId, index);
        const meaning = getCardMeaning(card, index);
        await sendMessage(userId, meaning);

        const session = getSession(userId);
        if (!isSessionComplete(userId)) {
          await updateMessageButtons(userId, msgId, renderCardButtons(session));
        } else {
          await updateMessageButtons(userId, msgId, { inline_keyboard: [] });
          await sendMessage(userId, await getSpiritGuide());
          await sendMessage(userId, await getLuckyHints());
          await sendMessage(userId, await getMoonAdvice());
          await sendMessage(userId, "✨ Unlock your deeper guidance:", renderPremiumButtonsInline());
        }
      } catch (err) {
        await sendMessage(userId, `⚠️ ${err.message}`);
      }
    }

    if (premiumHandlers[data]) {
      console.log("📥 Callback received:", data);

      // 👇 替换按钮为“加载中”
      await updateMessageButtons(userId, msgId, {
        inline_keyboard: [[{ text: "🔄 Loading...", callback_data: "loading_disabled" }]]
      });

      try {
        const response = await premiumHandlers[data](userId);
        await sendMessage(userId, response);

        // 👇 从按钮中移除当前点击项
        const currentMarkup = callback.message.reply_markup;
        const updatedMarkup = removeClickedButton(currentMarkup, data);
        await updateMessageButtons(userId, msgId, updatedMarkup);
      } catch (err) {
        console.error("❌ Premium handler error:", err);
        await sendMessage(userId, `⚠️ Failed to load: ${data}`);
      }
    }
  }
}

function removeClickedButton(replyMarkup, clickedCallbackData) {
  if (!replyMarkup || !replyMarkup.inline_keyboard) return { inline_keyboard: [] };

  const newKeyboard = replyMarkup.inline_keyboard
    .map(row => row.filter(btn => btn.callback_data !== clickedCallbackData))
    .filter(row => row.length > 0);

  return { inline_keyboard: newKeyboard };
}

async function sendMessage(chatId, text, reply_markup = null) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown"
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
