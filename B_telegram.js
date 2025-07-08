// B_telegram.js - v1.2.8

const axios = require("axios");
const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

const { getSession, isSessionComplete } = require("./G_tarot-session");
const { getCardInfo } = require("./G_tarot");
const { renderRemainingButtons } = require("./G_button-render"); // ✅ 正确函数名

const { getSpiritGuideMessage } = require("./G_spirit-guide");
const { getLuckyHint } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");

// ✅ 发送消息
async function sendMessage(chatId, text, extra = {}) {
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
    ...extra
  });
}

// ✅ 编辑按钮（点击后刷新按钮状态）
async function editInlineKeyboard(chatId, messageId, newMarkup) {
  await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: newMarkup
  });
}

// ✅ 主处理函数
async function handleTelegramUpdate(update) {
  // 🎯 处理点击按钮
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
          await sendMessage(chatId, "⚠️ Invalid card or session. Please try again later.");
          return;
        }

        // 🌟 每张牌都显示位置
        const positionLabels = ["🌒 *Past*", "🌕 *Present*", "🌘 *Future*"];
        const positionText = `${positionLabels[index]}\n${card.title}\n\n${card.meaning}`;

        await sendMessage(chatId, positionText, card.image ? {
          reply_markup: null,
          disable_web_page_preview: false
        } : {});

        const session = getSession(userId);
        if (!session) {
          await sendMessage(chatId, "⚠️ Session not found.");
          return;
        }

        // 🧩 按钮刷新：隐藏已抽项
        if (!isSessionComplete(userId)) {
          const remainingButtons = renderRemainingButtons(session.drawn, amount);
          await editInlineKeyboard(chatId, messageId, remainingButtons);
        } else {
          // 🧘‍♀️ 全部抽完，推送灵性补充内容
          await editInlineKeyboard(chatId, messageId, { inline_keyboard: [] }); // 清空按钮
          await sendMessage(chatId, getSpiritGuideMessage());
          await sendMessage(chatId, getLuckyHint());
          await sendMessage(chatId, getMoonAdvice());
        }

      } catch (err) {
        console.error("❌ Error handling callback_query:", err);
        await sendMessage(chatId, "❌ Error: " + err.message);
      }

      return;
    }
  }

  // 🎯 开发者测试入口
  if (update.message && update.message.text === "/test123") {
    const userId = update.message.from.id;
    if (userId === 7685088782) {
      const startSession = require("./G_tarot-session").startSession;
      startSession(userId, 12);
      await sendMessage(update.message.chat.id, "🧪 Test session created. Run `/test123` via browser to simulate draw.");
    } else {
      await sendMessage(update.message.chat.id, "❌ Unauthorized test command.");
    }
    return;
  }
}

module.exports = {
  handleTelegramUpdate
};
