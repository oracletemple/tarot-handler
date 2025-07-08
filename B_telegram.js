// B_telegram.js - v1.2.9

const axios = require("axios");
const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

const { getSession, isSessionComplete, startSession } = require("./G_tarot-session");
const { getCardInfo } = require("./G_tarot");
const { renderRemainingButtons } = require("./G_button-render");

const { getSpiritGuideMessage } = require("./G_spirit-guide");
const { getLuckyHint } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");

// ✅ 发送消息
async function sendMessage(chatId, text, extra = {}) {
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      ...extra
    });
  } catch (err) {
    console.error("❌ Failed to send message:", err.response?.data || err.message);
  }
}

// ✅ 编辑按钮
async function editInlineKeyboard(chatId, messageId, newMarkup) {
  try {
    await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: newMarkup
    });
  } catch (err) {
    console.error("❌ Failed to edit keyboard:", err.response?.data || err.message);
  }
}

// ✅ 主入口处理
async function handleTelegramUpdate(update) {
  // ✅ 按钮点击处理
  if (update.callback_query) {
    const { message, from, data } = update.callback_query;
    const chatId = message.chat.id;
    const userId = from.id;
    const messageId = message.message_id;

    if (data.startsWith("card_")) {
      const [_, indexStr, amountStr] = data.split("_");
      const index = parseInt(indexStr);
      const amount = parseFloat(amountStr);

      try {
        const card = getCardInfo(userId, index);
        if (!card) {
          await sendMessage(chatId, "⚠️ Invalid card or session.");
          return;
        }

        const label = ["🌒 *Past*", "🌕 *Present*", "🌘 *Future*"][index];
        await sendMessage(chatId, `${label}\n${card.title}\n\n${card.meaning}`);

        const session = getSession(userId);
        if (!session) {
          await sendMessage(chatId, "⚠️ Session not found.");
          return;
        }

        if (!isSessionComplete(userId)) {
          const markup = renderRemainingButtons(session.drawn, amount);
          await editInlineKeyboard(chatId, messageId, markup);
        } else {
          await editInlineKeyboard(chatId, messageId, { inline_keyboard: [] });
          await sendMessage(chatId, getSpiritGuideMessage());
          await sendMessage(chatId, getLuckyHint());
          await sendMessage(chatId, getMoonAdvice());
        }
      } catch (err) {
        console.error("❌ Callback handler error:", err);
        await sendMessage(chatId, "❌ " + err.message);
      }

      return;
    }
  }

  // ✅ 处理测试指令（只允许开发者本人）
  if (update.message && update.message.text === "/test123") {
    const userId = update.message.from.id;
    const chatId = update.message.chat.id;
    if (userId === 7685088782) {
      startSession(userId, 12);
      await sendMessage(chatId, "🧪 Test session created. Visit `/test123` URL to simulate draws.");
    } else {
      await sendMessage(chatId, "❌ You are not authorized.");
    }
    return;
  }
}

module.exports = { handleTelegramUpdate };
