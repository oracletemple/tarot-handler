// B_telegram.js - v1.2.9

const axios = require("axios");
const { getSession, startSession } = require("./G_tarot-session");
const { getCard } = require("./G_tarot-session");
const { getCardMeaning } = require("./G_tarot-engine");
const { renderCardButtons } = require("./G_button-render");
const { getSpiritGuide } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");
const { callDeepSeek } = require("./G_deepseek"); // ✅ 新增 DeepSeek 接口

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// ✅ 统一发送消息函数
async function sendMessage(chatId, text, options = {}) {
  await axios.post(`${API_URL}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
    ...options,
  });
}

// ✅ 处理 Telegram 回调或消息更新
async function handleTelegramUpdate(update) {
  const message = update.message;
  const callback = update.callback_query;

  if (message) {
    const userId = message.from.id;
    const text = message.text?.trim();

    // ✅ 仅允许开发者使用测试指令
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

    // 非测试指令则忽略
    return;
  }

  if (callback) {
    const userId = callback.from.id;
    const data = callback.data;

    const match = data.match(/^draw_card_(\d+)_(\d+)/);
    if (!match) return;

    const index = parseInt(match[1]);
    const amount = parseInt(match[2]);

    try {
      const card = getCard(userId, index);
      const meaning = getCardMeaning(card, index);

      // 删除当前按钮并只保留未抽的
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

        // ✅ DeepSeek 灵性回复
        const deepReply = await callDeepSeek("Offer a spiritual reflection based on today's energy.");
        await sendMessage(userId, `🪐 *DeepSeek Insight*\n\n${deepReply}`);
      }
    } catch (err) {
      await sendMessage(userId, `⚠️ ${err.message}`);
    }
  }
}

module.exports = { handleTelegramUpdate };
