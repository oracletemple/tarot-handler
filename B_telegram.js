// ⚠️ 本次生成的 B_telegram.js 文件需覆盖上传到 tarot-handler 根目录：
// B_telegram.js - v1.5.17

const axios = require('axios');
const { getSession, startSession, getCard, isSessionComplete } = require('./G_tarot-session');
const { getCardMeaning } = require('./G_tarot-engine');
const { renderCardButtons } = require('./G_button-render');
const { getSpiritGuide } = require('./G_spirit-guide');
const { getLuckyHints } = require('./G_lucky-hints');
const { getMoonAdvice } = require('./G_moon-advice');
const { renderPremiumButtonsInline, premiumHandlers, removeClickedButton } = require('./G_premium-buttons');
const { renderDirectoryButtons } = require('./G_premium-directory');
const { startFlow, getSession: getFlowSession, isSessionComplete, incrementDraw, markStep, markPremiumClick, getDirectoryData, debugFlow } = require('./G_flow-monitor');

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const DEFAULT_MS = 15000;
const BUFFER_MS = 2000;
const loadHistory = {};

async function answerCb(queryId, text = '', alert = false) {
  try {
    await axios.post(`${API_URL}/answerCallbackQuery`, { callback_query_id: queryId, text, show_alert: alert });
  } catch {
    // ignore
  }
}

function escapeMd(text) {
  return text.replace(/[_*\[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

async function sendMessage(chatId, text, reply_markup = null) {
  const payload = { chat_id: chatId, text: escapeMd(text), parse_mode: 'MarkdownV2' };
  if (reply_markup) payload.reply_markup = reply_markup;
  const res = await axios.post(`${API_URL}/sendMessage`, payload);
  return res.data.result.message_id;
}

async function editReplyMarkup(chatId, messageId, reply_markup) {
  await axios.post(`${API_URL}/editMessageReplyMarkup`, { chat_id: chatId, message_id: messageId, reply_markup });
}

async function editMessageText(chatId, messageId, text, reply_markup = null) {
  const payload = { chat_id: chatId, message_id: messageId, text: escapeMd(text), parse_mode: 'MarkdownV2' };
  if (reply_markup) payload.reply_markup = reply_markup;
  await axios.post(`${API_URL}/editMessageText`, payload);
}

// 主处理函数
async function handleTelegramUpdate(update) {
  const message = update.message;
  const callback = update.callback_query;

  // 文本命令处理
  if (message) {
    const chatId = message.chat.id;
    const text = message.text;
    if ((text === '/test123' || text === '/test12') && chatId == process.env.RECEIVER_ID) {
      startFlow(chatId);
      const session = startSession(chatId, 12);
      await sendMessage(chatId, '🃏 Please draw your cards:', renderCardButtons(session));
      return;
    }
    if (text === '/test30' && chatId == process.env.RECEIVER_ID) {
      startFlow(chatId);
      const session = startSession(chatId, 30);
      await sendMessage(chatId, '🃏 Please draw your cards:', renderCardButtons(session));
      return;
    }
    if (text === '/debugflow' && chatId == process.env.RECEIVER_ID) {
      const status = debugFlow(chatId);
      await sendMessage(chatId, status);
      return;
    }
  }

  // 回调处理
  if (!callback) return;
  const userId = callback.from.id;
  const data = callback.data;
  const msgId = callback.message.message_id;
  let session = getFlowSession(userId);

  // 自动启动基础版会话
  if (!session && data.startsWith('card_')) {
    startFlow(userId);
    session = startSession(userId, 12);
    await sendMessage(userId, '⚠️ Session not found. Started a 12 USDT session. Draw your cards:', renderCardButtons(session));
    return;
  }

  // 基础版点击高级模块提示支付
  if (premiumHandlers[data] && session.amount < 30) {
    await answerCb(callback.id, `Pay ${30 - session.amount} USDT to unlock`, true);
    await sendMessage(userId, 'Complete payment to unlock premium modules:', {
      inline_keyboard: [[{ text: `Pay ${30 - session.amount} USDT`, url: 'https://divinepay.onrender.com/' }]]
    });
    return;
  }

  // 抽卡逻辑
  if (data.startsWith('card_')) {
    const idx = parseInt(data.split('_')[1], 10);
    try {
      const card = getCard(userId, idx);
      const meaning = getCardMeaning(card, idx);
      await sendMessage(userId, meaning);
      incrementDraw(userId);
      if (!isSessionComplete(userId)) {
        await editReplyMarkup(userId, msgId, renderCardButtons(session));
      } else {
        await editReplyMarkup(userId, msgId, { inline_keyboard: [] });
        await sendMessage(userId, await getSpiritGuide()); markStep(userId, 'spiritGuide');
        await sendMessage(userId, await getLuckyHints());  markStep(userId, 'luckyHints');
        await sendMessage(userId, await getMoonAdvice());  markStep(userId, 'moonAdvice');
        await sendMessage(userId, '✨ Unlock deeper guidance:', renderPremiumButtonsInline());
        markStep(userId, 'premiumButtonsShown');
      }
    } catch (err) {
      await sendMessage(userId, `⚠️ ${err.message}`);
    }
    return;
  }

  // 高级模块点击+动态倒计时
  if (premiumHandlers[data] && session.amount >= 30) {
    session._premiumHandled = session._premiumHandled || new Set();
    if (session._premiumHandled.has(data)) return;
    session._premiumHandled.add(data);
    // 计算倒计时
    const history = loadHistory[data] || [];
    const avgMs = history.length ? history.reduce((a, b) => a + b, 0) / history.length : DEFAULT_MS;
    const secs = Math.ceil((avgMs + BUFFER_MS) / 1000);
    // 隐藏其它按钮，仅显示倒计时
    await answerCb(callback.id, '', false);
    await editReplyMarkup(userId, msgId, { inline_keyboard: [[{ text: `Fetching insight... ${secs}s`, callback_data: data }]] });
    let rem = secs;
    const iv = setInterval(async () => {
      rem--;
      if (rem >= 0) {
        await editReplyMarkup(userId, msgId, { inline_keyboard: [[{ text: `Fetching insight... ${rem}s`, callback_data: data }]] });
      }
      if (rem < 0) clearInterval(iv);
    }, 1000);
    // 调用模块
    const startTime = Date.now();
    let response;
    try {
      response = await premiumHandlers[data](userId);
    } catch (err) {
      clearInterval(iv);
      await sendMessage(userId, `⚠️ Failed to load: ${data}`);
      return;
    }
    const duration = Date.now() - startTime;
    loadHistory[data] = loadHistory[data] || [];
    loadHistory[data].push(duration);
    clearInterval(iv);
    // 移除按钮
    await editReplyMarkup(userId, msgId, removeClickedButton(callback.message.reply_markup, data));
    // 发送模块内容
    await sendMessage(userId, response);
    markPremiumClick(userId, data, response);
    // 发送目录
    const dir = renderDirectoryButtons(userId);
    await sendMessage(userId, '📂 Navigate modules:', dir);
    return;
  }

  // 目录导航点击
  if (data.startsWith('nav_')) {
    const key = data.replace('nav_', '');
    const { responses } = getDirectoryData(userId);
    const text = responses[key] || 'No content cached.';
    await answerCb(callback.id);
    await editMessageText(userId, msgId, text, renderDirectoryButtons(userId));
    return;
  }
}

module.exports = { handleTelegramUpdate };
