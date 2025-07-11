// B_telegram.js — v1.5.28
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
const BASE_URL = process.env.BASE_URL;
const DEFAULT_MS = 15000;
const BUFFER_MS = 2000;

// 辅助：按最大长度分割文本
function splitText(text, maxLen = 2000) {
  const parts = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + maxLen, text.length);
    if (end < text.length) {
      const idx = text.lastIndexOf(' ', end);
      if (idx > start) end = idx;
    }
    parts.push(text.slice(start, end));
    start = end;
  }
  return parts;
}

async function answerCallbackQuery(id, text = "", alert = false) {
  try {
    await axios.post(`${API_URL}/answerCallbackQuery`, { callback_query_id: id, text, show_alert: alert });
  } catch (err) {
    console.error("[answerCallbackQuery error]", err.response ? err.response.data : err.message);
  }
}

function escapeMarkdown(text) {
  return text.replace(/([_\*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

async function editReplyMarkup(chatId, messageId, reply_markup) {
  try {
    await axios.post(`${API_URL}/editMessageReplyMarkup`, { chat_id: chatId, message_id: messageId, reply_markup });
  } catch (err) {
    console.error("[editReplyMarkup error]", err.response ? err.response.data : err.message);
  }
}

// 全局 sendMessage，自动拆分长文本
async function sendMessage(chatId, text, reply_markup = null) {
  const chunks = splitText(text, 2000);
  for (let i = 0; i < chunks.length; i++) {
    const payload = { chat_id: chatId, text: escapeMarkdown(chunks[i]), parse_mode: "MarkdownV2" };
    if (i === 0 && reply_markup) payload.reply_markup = reply_markup;
    try {
      await axios.post(`${API_URL}/sendMessage`, payload);
    } catch (err) {
      console.error("[sendMessage error]", err.response ? err.response.data : err.message);
    }
  }
}

async function sendPhoto(chatId, photoUrl, caption, reply_markup = null) {
  try {
    console.log(`[sendPhoto] chatId=${chatId}, url=${photoUrl}`);
    const payload = { chat_id: chatId, photo: photoUrl, caption: escapeMarkdown(caption), parse_mode: "MarkdownV2" };
    if (reply_markup) payload.reply_markup = reply_markup;
    await axios.post(`${API_URL}/sendPhoto`, payload);
  } catch (err) {
    console.error("[sendPhoto error]", err.response ? err.response.data : err.message);
    // 回退文字发送
    await sendMessage(chatId, caption, reply_markup);
  }
}

function renderBasicButtons() {
  return { inline_keyboard: [
    [{ text: "🧚 Spirit Guide", callback_data: "basic_spirit" }],
    [{ text: "🎨 Lucky Hints",   callback_data: "basic_lucky" }],
    [{ text: "🌕 Moon Advice",   callback_data: "basic_moon" }]
  ]};
}

async function handleTelegramUpdate(update) {
  const msg = update.message;
  const cb = update.callback_query;

  if (msg) {
    const { chat: { id: chatId }, text } = msg;
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

  if (!cb) return;
  const userId = cb.from.id;
  const data   = cb.data;
  const msgId  = cb.message.message_id;
  const session= getSession(userId);

  // 🎴 抽牌回调
  if (data.startsWith("card_")) {
    await answerCallbackQuery(cb.id);
    const idx = parseInt(data.split("_")[1], 10);
    try {
      const card    = getCard(userId, idx);
      const meaning = getCardMeaning(card, idx);
      const imageUrl = `${BASE_URL}/tarot-images/${encodeURIComponent(card.image)}`;
      await sendPhoto(userId, imageUrl, meaning);
      incrementDraw(userId);
      if (!isSessionComplete(userId)) {
        await editReplyMarkup(userId, msgId, renderCardButtons(session));
      } else {
        await editReplyMarkup(userId, msgId, { inline_keyboard: [] });
        const basicKb   = renderBasicButtons().inline_keyboard;
        const premiumKb = renderPremiumButtonsInline().inline_keyboard;
        const separator = [[{ text: "── Advanced Exclusive Insights ──", callback_data: "noop" }]];
        const combined  = basicKb.concat(separator, premiumKb);
        await sendMessage(userId, "✨ Explore your guidance modules:", { inline_keyboard: combined });
        markStep(userId, "bothButtonsShown");
      }
    } catch (err) {
      console.error("[card handling error]", err);
      await sendMessage(userId, `⚠️ ${err.message}`);
    }
    return;
  }

  // 🌟 高级模块点击
  if (premiumHandlers[data]) {
    await answerCallbackQuery(cb.id);
    if (!session || session.amount < 30) {
      await sendMessage(userId, `Unlock by paying ${30 - (session?.amount||0)} USDT.`, { inline_keyboard: [[
        { text: `Pay ${30 - (session?.amount||0)} USDT`, url: 'https://divinepay.onrender.com/' }
      ]] });
      return;
    }
    try {
      const res = await premiumHandlers[data](userId);
      const rb = removeClickedButton(cb.message.reply_markup, data);
      await editReplyMarkup(userId, msgId, rb);
      await sendMessage(userId, res);
      markPremiumClick(userId, data);
    } catch (err) {
      console.error("[premium handling error]", err);
      await sendMessage(userId, `⚠️ Failed to load: ${data}`);
    }
    return;
  }
}

module.exports = { handleTelegramUpdate };
