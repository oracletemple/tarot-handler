/* ---------------------- B_telegram.js - v1.5.15 ----------------------- */
const axios = require('axios');
const { getSession, startSession, getCard, isSessionComplete } = require('./G_tarot-session');
const { getCardMeaning } = require('./G_tarot-engine');
const { renderCardButtons } = require('./G_button-render');
const { getSpiritGuide } = require('./G_spirit-guide');
const { getLuckyHints } = require('./G_lucky-hints');
const { getMoonAdvice } = require('./G_moon-advice');
const { renderPremiumButtonsInline, premiumHandlers, removeClickedButton } = require('./G_premium-buttons');
const { renderDirectoryButtons } = require('./G_premium-directory');
const { startFlow, incrementDraw, markStep, markPremiumClick, getDirectoryData, debugFlow } = require('./G_flow-monitor');

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function answerCb(queryId, text, alert=false) {
  try {
    await axios.post(`${API_URL}/answerCallbackQuery`, { callback_query_id: queryId, text, show_alert: alert });
  } catch {};
}

function escapeMd(text) {
  return text.replace(/[_*\[\]()~`>#+\-=|{}.!]/g, '\\$&');
}

async function sendMessage(chatId, text, reply_markup=null) {
  const payload = { chat_id: chatId, text: escapeMd(text), parse_mode: 'MarkdownV2' };
  if (reply_markup) payload.reply_markup = reply_markup;
  const res = await axios.post(`${API_URL}/sendMessage`, payload);
  return res.data.result.message_id;
}

async function editReplyMarkup(chatId, messageId, reply_markup) {
  await axios.post(`${API_URL}/editMessageReplyMarkup`, { chat_id: chatId, message_id: messageId, reply_markup });
}

async function handleTelegramUpdate(update) {
  const msg = update.message;
  const cb = update.callback_query;
  if (msg) {
    const { chat: { id: chatId }, text } = msg;
    if ((text==='/test123'||text==='/test12')&&chatId==process.env.RECEIVER_ID) {
      startFlow(chatId);
      const session = startSession(chatId,12);
      await sendMessage(chatId,'🃏 Please draw your cards:', renderCardButtons(session));
      return;
    }
    if (text==='/test30'&&chatId==process.env.RECEIVER_ID) {
      startFlow(chatId);
      const session = startSession(chatId,30);
      await sendMessage(chatId,'🃏 Please draw your cards:', renderCardButtons(session));
      return;
    }
    if (text==='/debugflow'&&chatId==process.env.RECEIVER_ID) {
      const status = debugFlow(chatId);
      await sendMessage(chatId,status);
      return;
    }
  }
  if (!cb) return;

  const userId = cb.from.id;
  const data = cb.data;
  const msgId = cb.message.message_id;
  const session = getSession(userId);

  // 基础版访问高级
  if (premiumHandlers[data] && session.amount<30) {
    await answerCb(cb.id,`Pay ${(30-session.amount)} USDT to unlock`,true);
    await sendMessage(userId,'Complete payment:',{ inline_keyboard:[[{ text:`Pay ${30-session.amount} USDT`, url:'https://divinepay.onrender.com/'}]] });
    return;
  }

  // 抽卡逻辑
  if (data.startsWith('card_')) {
    const idx = +data.split('_')[1];
    try {
      const card = getCard(userId,idx);
      const meaning = getCardMeaning(card,idx);
      await sendMessage(userId,meaning);
      incrementDraw(userId);
      if (!isSessionComplete(userId)) {
        await editReplyMarkup(userId,msgId,renderCardButtons(session));
      } else {
        await editReplyMarkup(userId,msgId,{ inline_keyboard:[] });
        await sendMessage(userId,await getSpiritGuide()); markStep(userId,'spiritGuide');
        await sendMessage(userId,await getLuckyHints());  markStep(userId,'luckyHints');
        await sendMessage(userId,await getMoonAdvice());  markStep(userId,'moonAdvice');
        await sendMessage(userId,'✨ Unlock deeper guidance:',renderPremiumButtonsInline());
        markStep(userId,'premiumButtonsShown');
      }
    } catch(e) {
      await sendMessage(userId,`⚠️ ${e.message}`);
    }
    return;
  }

  // 高端模块
  if (premiumHandlers[data] && session.amount>=30) {
    session._premiumHandled=session._premiumHandled||new Set(); if(session._premiumHandled.has(data))return; session._premiumHandled.add(data);
    // 调用并记录内容
    const start = Date.now();
    const response = await premiumHandlers[data](userId);
    const duration = Date.now()-start;
    markPremiumClick(userId,data,response);
    // 发送内容
    const contentId = await sendMessage(userId,response);
    // 发送目录
    const dirButtons = renderDirectoryButtons(userId);
    await sendMessage(userId,'📂 Navigate modules:',dirButtons);
    return;
  }

  // 目录导航
  if (data.startsWith('nav_')) {
    const key = data.replace('nav_','');
    const { responses } = getDirectoryData(userId);
    const text = responses[key] || 'No content available.';
    await answerCb(cb.id,'',false);
    await sendMessage(userId,text);
  }
}

module.exports = { handleTelegramUpdate };
