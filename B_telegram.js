// ⚠️ 本次生成的 B_telegram.js 文件需覆盖上传到以下位置：
// - tarot-handler/B_telegram.js

// B_telegram.js - v1.5.12
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
  return text.replace(/[_*\[\]()~`>#+\-=|{}.!]/g, '\\$&');
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

    // 基础版访问高级模块 => 支付提示
    if (premiumHandlers[data] && session.amount < 30) {
      await answerCbQuery(callback.id, `Unlock by paying ${30 - session.amount} USDT.`, true);
      await sendMessage(userId,
        'To access premium guidance, complete payment:',
        { inline_keyboard: [[{ text: `Pay ${30 - session.amount} USDT Now`, url: 'https://divinepay.onrender.com/' }]] }
      );
      return;
    }

    // 卡牌交互
    if (data.startsWith("card_")) {
      const idx = parseInt(data.split("_")[1], 10);
      try {
        const card = getCard(userId, idx);
        const meaning = getCardMeaning(card, idx);
        await sendMessage(userId, meaning);
        incrementDraw(userId);
        if (!isSessionComplete(userId)) {
          await updateMessageButtons(userId, msgId, renderCardButtons(session));
        } else {
          await updateMessageButtons(userId, msgId, { inline_keyboard: [] });
          const guide = await getSpiritGuide(); await sendMessage(userId, guide); markStep(userId, "spiritGuide");
          const hints = await getLuckyHints(); await sendMessage(userId, hints); markStep(userId, "luckyHints");
          const moon  = await getMoonAdvice(); await sendMessage(userId, moon); markStep(userId, "moonAdvice");
          await sendMessage(userId, "✨ Unlock your deeper guidance:", renderPremiumButtonsInline());
          markStep(userId, "premiumButtonsShown");
        }
      } catch (err) {
        await sendMessage(userId, `⚠️ ${err.message}`);
      }
      return;
    }

    // 高端模块点击 => 倒计时 + 内容置顶更新
    if (premiumHandlers[data] && session.amount >= 30) {
      // 防重复
      session._premiumHandled = session._premiumHandled || new Set();
      if (session._premiumHandled.has(data)) return;
      session._premiumHandled.add(data);

      // 倒计时显示
      let countdown = 5;
      const timer = setInterval(async () => {
        try {
          const updatedKb = callback.message.reply_markup.inline_keyboard.map(row =>
            row.map(btn => btn.callback_data === data
              ? { ...btn, text: `正在读取 ${countdown}s` }
              : btn
            )
          );
          await axios.post(`${API_URL}/editMessageReplyMarkup`, {
            chat_id: userId,
            message_id: msgId,
            reply_markup: { inline_keyboard: updatedKb }
          });
          countdown--;
          if (countdown < 0) clearInterval(timer);
        } catch {} 
      }, 1000);

      try {
        // 调用 API 获取内容
        const content = await premiumHandlers[data](userId);
        clearInterval(timer);
        // 移除该按钮
        const newKb = removeClickedButton(callback.message.reply_markup, data);
        // 更新消息：将内容置顶在按钮下方
        const fullText = `✨ Unlock your deeper guidance:\n\n${content}`;
        await axios.post(`${API_URL}/editMessageText`, {
          chat_id: userId,
          message_id: msgId,
          text: escapeMarkdown(fullText),
          parse_mode: "MarkdownV2",
          reply_markup: newKb
        });
        markPremiumClick(userId, data);
      } catch (err) {
        clearInterval(timer);
        const errText = `⚠️ Failed to load: ${data}`;
        await axios.post(`${API_URL}/editMessageText`, {
          chat_id: userId,
          message_id: msgId,
          text: escapeMarkdown(`✨ Unlock your deeper guidance:\n\n${errText}`),
          parse_mode: "MarkdownV2",
          reply_markup: callback.message.reply_markup
        });
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
  if (reply_markup) {
    payload.reply_markup = reply_markup;
  }
  try {
    const res = await axios.post(`${API_URL}/sendMessage`, payload);
    return res;
  } catch (err) {
    console.error("Telegram sendMessage error:", err.response?.data || err.message);
  }
}/sendMessage`, {
    chat_id: chatId,
    text: escapeMarkdown(text),
    parse_mode: "MarkdownV2",
    reply_markup
  });
}

async function updateMessageButtons(chatId, messageId, reply_markup) {
  await axios.post(`${API_URL}/editMessageReplyMarkup`, {
    chat_id: chatId,
    message_id: messageId,
    reply_markup
  });
}

async function answerCbQuery(id, text, alert=false) {
  await axios.post(`${API_URL}/answerCallbackQuery`, { callback_query_id: id, text, show_alert: alert });
}

module.exports = { handleTelegramUpdate };
