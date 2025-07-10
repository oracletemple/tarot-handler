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

function escapeMarkdown(text) {
  return text.replace(/[_*\[\]()~`>#+\-=|{}.!]/g, "\\$&");
}

async function answerCallbackQuery(callbackQueryId, text, alert = false) {
  try {
    await axios.post(`${API_URL}/answerCallbackQuery`, {
      callback_query_id: callbackQueryId,
      text,
      show_alert: alert
    });
  } catch (err) {
    console.error("❌ answerCallbackQuery error:", err.response?.data || err.message);
  }
}

async function sendMessage(chatId, text, reply_markup = null) {
  const payload = { chat_id: chatId, text: escapeMarkdown(text), parse_mode: "MarkdownV2" };
  if (reply_markup) payload.reply_markup = reply_markup;
  try {
    return await axios.post(`${API_URL}/sendMessage`, payload);
  } catch (err) {
    console.error("❌ Telegram sendMessage error:", err.response?.data || err.message);
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
    console.error("❌ Telegram updateMessageButtons error:", err.response?.data || err.message);
  }
}

async function editMessageText(chatId, messageId, text, reply_markup) {
  try {
    await axios.post(`${API_URL}/editMessageText`, {
      chat_id: chatId,
      message_id: messageId,
      text: escapeMarkdown(text),
      parse_mode: "MarkdownV2",
      reply_markup
    });
  } catch (err) {
    console.error("❌ Telegram editMessageText error:", err.response?.data || err.message);
  }
}

async function handleTelegramUpdate(update) {
  const message = update.message;
  const callback = update.callback_query;

  if (message) {
    const chatId = message.chat.id;
    const text = message.text;
    if ((text === "/test123" || text === "/test12") && chatId == process.env.RECEIVER_ID) {
      const session = startSession(chatId, 12);
      startFlow(chatId);
      await sendMessage(chatId, "🃏 Please draw your cards:", renderCardButtons(session));
    }
    if (text === "/test30" && chatId == process.env.RECEIVER_ID) {
      const session = startSession(chatId, 30);
      startFlow(chatId);
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

    // 基础版访问高级模块：提示支付
    if (premiumHandlers[data] && session.amount < 30) {
      await answerCallbackQuery(callback.id, `Unlock by paying ${30 - session.amount} USDT.`, true);
      await sendMessage(userId,
        'To access premium guidance, complete payment:',
        { inline_keyboard: [[{ text: `Pay ${30 - session.amount} USDT Now`, url: 'https://divinepay.onrender.com/' }]] }
      );
      return;
    }

    // 基础卡牌互动
    if (data.startsWith("card_")) {
      const index = parseInt(data.split("_")[1], 10);
      try {
        const card = getCard(userId, index);
        const meaning = getCardMeaning(card, index);
        await sendMessage(userId, meaning);
        incrementDraw(userId);

        if (!isSessionComplete(userId)) {
          await updateMessageButtons(userId, msgId, renderCardButtons(session));
        } else {
          await updateMessageButtons(userId, msgId, { inline_keyboard: [] });
          const guide = await getSpiritGuide(); markStep(userId, "spiritGuide");
          await sendMessage(userId, guide);
          const hints = await getLuckyHints(); markStep(userId, "luckyHints");
          await sendMessage(userId, hints);
          const moon = await getMoonAdvice(); markStep(userId, "moonAdvice");
          await sendMessage(userId, moon);
          await sendMessage(userId, "✨ Unlock your deeper guidance:", renderPremiumButtonsInline());
          markStep(userId, "premiumButtonsShown");
        }
      } catch (err) {
        await sendMessage(userId, `⚠️ ${err.message}`);
      }
      return;
    }

    // 高级模块点击：倒计时 + 内容累积于同一消息下
    if (premiumHandlers[data] && session.amount >= 30) {
      session._premiumHandled = session._premiumHandled || new Set();
      if (session._premiumHandled.has(data)) return;
      session._premiumHandled.add(data);

      // 倒计时显示5秒
      let countdown = 5;
      const countdownInterval = setInterval(async () => {
        const kb = callback.message.reply_markup.inline_keyboard.map(row =>
          row.map(btn => btn.callback_data === data
            ? { ...btn, text: `正在读取 ${countdown}s` }
            : btn
          )
        );
        await updateMessageButtons(userId, msgId, { inline_keyboard: kb });
        countdown--;
        if (countdown < 0) clearInterval(countdownInterval);
      }, 1000);

      try {
        const content = await premiumHandlers[data](userId);
        clearInterval(countdownInterval);
        const newKb = removeClickedButton(callback.message.reply_markup, data);
        // 累积内容
        const existing = callback.message.text || "✨ Unlock your deeper guidance:";
        const updatedText = existing + "\n\n" + content;
        await editMessageText(userId, msgId, updatedText, newKb);
        markPremiumClick(userId, data);
      } catch (err) {
        clearInterval(countdownInterval);
        const errorMsg = `⚠️ Failed to load: ${data}`;
        const existing = callback.message.text || "✨ Unlock your deeper guidance:";
        const updatedText = existing + "\n\n" + errorMsg;
        await editMessageText(userId, msgId, updatedText, callback.message.reply_markup);
      }
      return;
    }
  }
}

module.exports = { handleTelegramUpdate };
