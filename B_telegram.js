// ⚠️ 本次生成的 B_telegram.js 文件需覆盖上传到以下位置：
// - tarot-handler/B_telegram.js

// B_telegram.js - v1.5.14
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
const DEFAULT_MS = 15000;
const BUFFER_MS = 2000;
// 记录各模块加载时长的历史数组
const loadHistory = {};

async function answerCallbackQuery(callbackQueryId, text, alert = false) {
  try {
    await axios.post(`${API_URL}/answerCallbackQuery`, {
      callback_query_id: callbackQueryId,
      text,
      show_alert: alert
    });
  } catch (err) {
    console.error("❌ answerCbQuery error:", err.response?.data || err.message);
  }
}

function escapeMarkdown(text) {
  return text.replace(/[_*\[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

async function editReplyMarkup(chatId, messageId, reply_markup) {
  try {
    await axios.post(`${API_URL}/editMessageReplyMarkup`, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup
    });
  } catch (err) {
    console.error("❌ editMessageReplyMarkup error:", err.response?.data || err.message);
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
    await axios.post(`${API_URL}/sendMessage`, payload);
  } catch (err) {
    console.error("❌ sendMessage error:", err.response?.data || err.message);
  }
}

async function handleTelegramUpdate(update) {
  const message = update.message;
  const callback = update.callback_query;

  if (message) {
    const chatId = message.chat.id;
    const text = message.text;
    if ((text === "/test123" || text === "/test12") && chatId == process.env.RECEIVER_ID) {
      startFlow(chatId);
      const session = startSession(chatId, 12);
      await sendMessage(chatId, "🃏 Please draw your cards:", renderCardButtons(session));
      return;
    }
    if (text === "/test30" && chatId == process.env.RECEIVER_ID) {
      startFlow(chatId);
      const session = startSession(chatId, 30);
      await sendMessage(chatId, "🃏 Please draw your cards:", renderCardButtons(session));
      return;
    }
    if (text === "/debugflow" && chatId == process.env.RECEIVER_ID) {
      const status = debugFlow(chatId);
      await sendMessage(chatId, status);
      return;
    }
  }

  if (!callback) return;
  const userId = callback.from.id;
  const data = callback.data;
  const msgId = callback.message.message_id;
  const session = getSession(userId);

  // 基础版访问高级模块
  if (premiumHandlers[data] && session.amount < 30) {
    await answerCallbackQuery(callback.id, `Unlock by paying ${30 - session.amount} USDT`, true);
    await sendMessage(userId, 'Please complete payment to unlock:',
      { inline_keyboard: [[{ text: `Pay ${30 - session.amount} USDT`, url: 'https://divinepay.onrender.com/' }]] }
    );
    return;
  }

  // 卡牌点击逻辑
  if (data.startsWith("card_")) {
    const idx = parseInt(data.split("_")[1], 10);
    try {
      const card = getCard(userId, idx);
      const meaning = getCardMeaning(card, idx);
      await sendMessage(userId, meaning);
      incrementDraw(userId);
      if (!isSessionComplete(userId)) {
        await editReplyMarkup(userId, msgId, renderCardButtons(session));
      } else {
        await editReplyMarkup(userId, msgId, { inline_keyboard: [] });
        await sendMessage(userId, await getSpiritGuide()); markStep(userId, "spiritGuide");
        await sendMessage(userId, await getLuckyHints());  markStep(userId, "luckyHints");
        await sendMessage(userId, await getMoonAdvice());  markStep(userId, "moonAdvice");
        await sendMessage(userId, "✨ Unlock your deeper guidance:", renderPremiumButtonsInline());
        markStep(userId, "premiumButtonsShown");
      }
    } catch (err) {
      await sendMessage(userId, `⚠️ ${err.message}`);
    }
    return;
  }

  // 高端模块点击逻辑
  if (premiumHandlers[data] && session.amount >= 30) {
    session._premiumHandled = session._premiumHandled || new Set();
    if (session._premiumHandled.has(data)) return;
    session._premiumHandled.add(data);

    // 计算动态倒计时
    const history = loadHistory[data] || [];
    const avgMs = history.length ? history.reduce((a, b) => a + b, 0) / history.length : DEFAULT_MS;
    const countdown = Math.ceil((avgMs + BUFFER_MS) / 1000);

    // 禁用其他按钮，仅保留倒计时按钮
    await answerCallbackQuery(callback.id, '', false);
    await editReplyMarkup(userId, msgId, { inline_keyboard: [[{ text: `Fetching insight... ${countdown}s`, callback_data: data }]] });

    let remaining = countdown;
    const interval = setInterval(async () => {
      try {
        remaining--;
        if (remaining >= 0) {
          await editReplyMarkup(userId, msgId, { inline_keyboard: [[{ text: `Fetching insight... ${remaining}s`, callback_data: data }]] });
        }
        if (remaining < 0) clearInterval(interval);
      } catch {}
    }, 1000);

    // 调用模块并测时
    const startTime = Date.now();
    try {
      const response = await premiumHandlers[data](userId);
      const duration = Date.now() - startTime;
      loadHistory[data] = loadHistory[data] || [];
      loadHistory[data].push(duration);

      clearInterval(interval);
      const removedMarkup = removeClickedButton(callback.message.reply_markup, data);
      await editReplyMarkup(userId, msgId, removedMarkup);
      await sendMessage(userId, response);
      markPremiumClick(userId, data);
    } catch (err) {
      clearInterval(interval);
      await sendMessage(userId, `⚠️ Failed to load: ${data}`);
    }
    return;
  }
}

module.exports = { handleTelegramUpdate };
