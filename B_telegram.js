// B_telegram.js — v1.5.25
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
const loadHistory = {};

async function answerCallbackQuery(id, text = "", alert = false) {
  try {
    await axios.post(`${API_URL}/answerCallbackQuery`, { callback_query_id: id, text, show_alert: alert });
  } catch (err) {
    console.error("[answerCallbackQuery error]", err.response ? err.response.data : err.message);
  }
}

function escapeMarkdown(text) {
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
}

async function editReplyMarkup(chatId, messageId, reply_markup) {
  try {
    await axios.post(`${API_URL}/editMessageReplyMarkup`, { chat_id: chatId, message_id: messageId, reply_markup });
  } catch (err) {
    console.error("[editReplyMarkup error]", err.response ? err.response.data : err.message);
  }
}

async function sendMessage(chatId, text, reply_markup = null) {
  const payload = { chat_id: chatId, text: escapeMarkdown(text), parse_mode: "MarkdownV2" };
  if (reply_markup) payload.reply_markup = reply_markup;
  try {
    await axios.post(`${API_URL}/sendMessage`, payload);
  } catch (err) {
    console.error("[sendMessage error]", err.response ? err.response.data : err.message);
  }
}

// ⚠️ 本次升级：发送图片方法
async function sendPhoto(chatId, photoUrl, caption, reply_markup = null) {
  try {
    console.log(`[sendPhoto] chatId=${chatId}, url=${photoUrl}`);
    const payload = { chat_id: chatId, photo: photoUrl, caption: escapeMarkdown(caption), parse_mode: "MarkdownV2" };
    if (reply_markup) payload.reply_markup = reply_markup;
    await axios.post(`${API_URL}/sendPhoto`, payload);
  } catch (err) {
    console.error("[sendPhoto error]", err.response ? err.response.data : err.message);
    await sendMessage(chatId, caption);
  }
}

// 辅助：按最大长度分割文本
function splitText(text, maxLen = 900) {
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

// 基础版模块按钮
function renderBasicButtons() {
  return { inline_keyboard: [
    [{ text: "🧚 Spirit Guide", callback_data: "basic_spirit" }],
    [{ text: "🎨 Lucky Hints", callback_data: "basic_lucky" }],
    [{ text: "🌕 Moon Advice", callback_data: "basic_moon" }]
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
  const data = cb.data;
  const msgId = cb.message.message_id;
  const session = getSession(userId);

  // 🔒 基础版访问高级模块
  if (premiumHandlers[data] && session.amount < 30) {
    await answerCallbackQuery(cb.id, `Unlock by paying ${30 - session.amount} USDT`, true);
    await sendMessage(userId, "Please complete payment to unlock this module:", { inline_keyboard: [[{ text: `Pay ${30 - session.amount} USDT`, url: "https://divinepay.onrender.com/" }]] });
    return;
  }

  // 🧚 基础版模块点击
  if (data.startsWith("basic_")) {
    session._basicHandled = session._basicHandled || new Set();
    if (session._basicHandled.has(data)) return;
    session._basicHandled.add(data);

    const history = loadHistory[data] || [];
    const avgMs = history.length ? history.reduce((a,b)=>a+b,0)/history.length : DEFAULT_MS;
    const countdown = Math.ceil((avgMs + BUFFER_MS) / 1000);

    await answerCallbackQuery(cb.id);
    await editReplyMarkup(userId, msgId, { inline_keyboard:[[ { text:`Fetching insight... ${countdown}s`, callback_data:data } ]] });

    let rem = countdown;
    const iv = setInterval(async()=>{
      rem--;
      if(rem>=0) await editReplyMarkup(userId, msgId, { inline_keyboard:[[ { text:`Fetching insight... ${rem}s`, callback_data:data } ]] });
      if(rem<0) clearInterval(iv);
    },1000);

    const start = Date.now();
    let handler;
    if(data==='basic_spirit') handler=()=>getSpiritGuide(userId);
    if(data==='basic_lucky') handler=()=>getLuckyHints(userId);
    if(data==='basic_moon') handler=()=>getMoonAdvice(userId);

    try{
      const result = await handler();
      const duration = Date.now()-start;
      loadHistory[data]=(loadHistory[data]||[]).concat(duration);

      clearInterval(iv);
      const kb = removeClickedButton(cb.message.reply_markup, data);
      await editReplyMarkup(userId, msgId, kb);
      await sendMessage(userId, result);
      markStep(userId,data);
    }catch(e){
      clearInterval(iv);
      await sendMessage(userId, `⚠️ Failed to load: ${data}`);
    }
    return;
  }

  // ♠️ 抽牌逻辑
  if(data.startsWith("card_")){
    await answerCallbackQuery(cb.id);
    const idx = parseInt(data.split('_')[1],10);
    try{
      const card=getCard(userId,idx);
      const meaning=getCardMeaning(card,idx);
      const imageUrl=`${BASE_URL}/tarot-images/${encodeURIComponent(card.image)}`;
      await sendPhoto(userId,imageUrl,meaning);
      incrementDraw(userId);
      if(!isSessionComplete(userId)){
        await editReplyMarkup(userId,msgId,renderCardButtons(session));
      }else{
        await editReplyMarkup(userId,msgId,{inline_keyboard:[]});
        const basicKb=renderBasicButtons().inline_keyboard;
        const premiumKb=renderPremiumButtonsInline().inline_keyboard;
        const sep=[[{text:"── Advanced Exclusive Insights ──",callback_data:"noop"}]];
        await sendMessage(userId,"✨ Explore your guidance modules:",{inline_keyboard:basicKb.concat(sep,premiumKb)});
        markStep(userId,'bothButtonsShown');
      }
    }catch(e){
      console.error('[card handling error]',e);
      await sendMessage(userId, `⚠️ ${e.message}`);
    }
    return;
  }

  // 🌟 高级版模块点击
  if(premiumHandlers[data] && session.amount>=30){
    session._premiumHandled=session._premiumHandled||new Set();
    if(session._premiumHandled.has(data))return;
    session._premiumHandled.add(data);

    await answerCallbackQuery(cb.id);
    const history=loadHistory[data]||[];
    const avgMs=history.length?history.reduce((a,b)=>a+b,0)/history.length:DEFAULT_MS;
    const countdown=Math.ceil((avgMs+BUFFER_MS)/1000);
    await editReplyMarkup(userId,msgId,{inline_keyboard:[[{text:`Fetching insight... ${countdown}s`,callback_data:data}]]});

    let rem2=countdown;
    const iv2=setInterval(async()=>{rem2--;if(rem2>=0)await editReplyMarkup(userId,msgId,{inline_keyboard:[[{text:`Fetching insight... ${rem2}s`,callback_data:data}]]});if(rem2<0)clearInterval(iv2);},1000);

    const start2=Date.now();
    try{
      const res=await premiumHandlers[data](userId);
      const dur=Date.now()-start2;
      loadHistory[data]=(loadHistory[data]||[]).concat(dur);

      clearInterval(iv2);
      const rb=removeClickedButton(cb.message.reply_markup,data);
      await editReplyMarkup(userId,msgId,rb);
      // ⚠️ 处理长文本拆分发送
      const parts=splitText(res,900);
      for(const part of parts) await sendMessage(userId,part);
      markPremiumClick(userId,data);
    }catch(err){
      clearInterval(iv2);
      console.error('[premium handling error]',err);
      await sendMessage(userId,`⚠️ Failed to load: ${data}`);
    }
    return;
  }
}

module.exports={handleTelegramUpdate};
