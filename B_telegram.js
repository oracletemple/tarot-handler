// B_telegram.js - v1.2.7

const axios = require("axios");
const { getSession, getCard, isSessionComplete } = require("./G_tarot-session");
const { getCardMeaning } = require("./G_tarot-engine");
const { renderRemainingButtons } = require("./G_button-render");

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * 主处理函数：处理 Telegram Webhook Update
 */
async function handleTelegramUpdate(update) {
  if (update.message && update.message.text) {
    const userId = update.message.from.id;
    const text = update.message.text.trim();

    // 忽略一切非 /test123 的文本（测试指令由 B_index 控制）
    if (text.startsWith("/")) {
      console.log(`ℹ️ Ignored command: ${text}`);
    }
  }

  if (update.callback_query) {
    const { id, from, message, data } = update.callback_query;
    const userId = from.id;
    const messageId = message.message_id;
    const chatId = message.chat.id;

    if (!data.startsWith("card_")) return;

    const parts = data.split("_");
    const cardIndex = parseInt(parts[1], 10);
    const amount = parseInt(parts[2], 10);

    const session = getSession(userId);
    if (!session) {
      await answerCallback(id, "⚠️ Session not found. Please try again later.");
      return;
    }

    if (session.drawn.includes(cardIndex)) {
      await answerCallback(id, "⚠️ You've already drawn this card.");
      return;
    }

    try {
      const card = getCard(userId, cardIndex);
      const interpretation = getCardMeaning(card, cardIndex); // 👈 新版结构

      // 更新该牌位置消息
      await sendMessage(chatId, interpretation);

      // 更新按钮（隐藏已抽）
      const updatedButtons = renderRemainingButtons(cardIndex, session);
      await editMessageReplyMarkup(chatId, messageId, updatedButtons);

      // 若全部抽完，追加灵性模块
      if (isSessionComplete(userId)) {
        await sendMessage(chatId, `🌟 All cards revealed.\nNow aligning spiritual energies...`);
        await sendMessage(chatId, generateSpiritGuide()); // 守护灵
        await sendMessage(chatId, generateLuckyHints()); // 幸运色数字
        await sendMessage(chatId, generateMoonAdvice()); // 月亮建议
      }

      await answerCallback(id);
    } catch (err) {
      console.error("❌ Error handling callback_query:", err);
      await answerCallback(id, "❌ Failed to draw card.");
    }
  }
}

/**
 * 回答按钮点击回调（可选提示）
 */
async function answerCallback(callbackId, text) {
  try {
    await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
      callback_query_id: callbackId,
      text,
      show_alert: !!text
    });
  } catch (err) {
    console.error("❌ Failed to answer callback:", err.message);
  }
}

/**
 * 发送消息
 */
async function sendMessage(chatId, text) {
  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "Markdown"
    });
  } catch (err) {
    console.error("❌ Failed to send message:", err.message);
  }
}

/**
 * 编辑按钮区域（隐藏已抽）
 */
async function editMessageReplyMarkup(chatId, messageId, buttons) {
  try {
    await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: {
        inline_keyboard: buttons
      }
    });
  } catch (err) {
    console.error("❌ Failed to edit buttons:", err.message);
  }
}

// 灵性模块生成（可拆分为独立模块）
function generateSpiritGuide() {
  const guides = ["🦉 Owl", "🦋 Butterfly", "🐺 Wolf", "🐍 Snake", "🦄 Unicorn"];
  const meanings = [
    "Wisdom from the unseen.",
    "Transformation is unfolding.",
    "Trust your instincts.",
    "Shed the old, embrace the new.",
    "Embrace the magic within."
  ];
  const i = Math.floor(Math.random() * guides.length);
  return `🧚 Your Spirit Guide: *${guides[i]}*\n${meanings[i]}`;
}

function generateLuckyHints() {
  const colors = ["Violet", "Gold", "Turquoise", "Emerald", "Crimson"];
  const numbers = [3, 7, 9, 11, 21];
  const i = Math.floor(Math.random() * colors.length);
  return `🎨 Lucky Color: *${colors[i]}*\n🔢 Lucky Number: *${numbers[i]}*`;
}

function generateMoonAdvice() {
  const advices = [
    "🌑 New Moon: Set your intentions.",
    "🌓 First Quarter: Take action.",
    "🌕 Full Moon: Release and celebrate.",
    "🌗 Last Quarter: Reflect and renew."
  ];
  return `🌙 Moon Message: ${advices[Math.floor(Math.random() * advices.length)]}`;
}

module.exports = { handleTelegramUpdate };
