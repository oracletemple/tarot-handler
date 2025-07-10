/* ---------------------- B_telegram.js - v1.5.16 ----------------------- */
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
const DEFAULT_MS = 15000;
const BUFFER_MS = 2000;
const loadHistory = {};

async function answerCb(queryId, text, alert=false) {
  try { await axios.post(`${API_URL}/answerCallbackQuery`, { callback_query_id: queryId, text, show_alert: alert }); }
  catch {};
}
function escapeMd(text) { return text.replace(/[_*\[\]()~`>#+\-=|{}.!]/g, '\\$&'); }
async function sendMessage(chatId, text, reply_markup=null) {
  const payload={ chat_id:chatId, text:escapeMd(text), parse_mode:'MarkdownV2' };
  if(reply_markup) payload.reply_markup=reply_markup;
  const res=await axios.post(`${API_URL}/sendMessage`, payload);
  return res.data.result.message_id;
}
async function editReplyMarkup(chatId, messageId, reply_markup) {
  await axios.post(`${API_URL}/editMessageReplyMarkup`, { chat_id:chatId, message_id:messageId, reply_markup });
}
async function editMessageText(chatId, messageId, text, reply_markup) {
  await axios.post(`${API_URL}/editMessageText`, { chat_id:chatId, message_id:messageId, text:escapeMd(text), parse_mode:'MarkdownV2', reply_markup });
}

async function handleTelegramUpdate(update) {
  const msg=update.message, cb=update.callback_query;
  if(msg) {
    const chatId=msg.chat.id, text=msg.text;
    if((text==='/test123'||text==='/test12')&&chatId==process.env.RECEIVER_ID) {
      startFlow(chatId);
      const session=startSession(chatId,12);
      await sendMessage(chatId,'🃏 Please draw your cards:',renderCardButtons(session)); return;
    }
    if(text==='/test30'&&chatId==process.env.RECEIVER_ID) {
      startFlow(chatId);
      const session=startSession(chatId,30);
      await sendMessage(chatId,'🃏 Please draw your cards:',renderCardButtons(session)); return;
    }
    if(text==='/debugflow'&&chatId==process.env.RECEIVER_ID) {
      const status=debugFlow(chatId);
      await sendMessage(chatId,status); return;
    }
  }
  if(!cb) return;
  const userId=cb.from.id, data=cb.data, msgId=cb.message.message_id;
  const session=getSession(userId);
  // 基础用户点高级
  if(premiumHandlers[data]&&session.amount<30) {
    await answerCb(cb.id,`Pay ${30-session.amount} USDT to unlock`,true);
    await sendMessage(userId,'Complete payment:',{inline_keyboard:[[{text:`Pay ${30-session.amount} USDT`,url:'https://divinepay.onrender.com/'}]]}); return;
  }
  // 抽卡互动
  if(data.startsWith('card_')) {
    const idx=+data.split('_')[1];
    try {
      const card=getCard(userId,idx), meaning=getCardMeaning(card,idx);
      await sendMessage(userId,meaning);
      incrementDraw(userId);
      if(!isSessionComplete(userId)) await editReplyMarkup(userId,msgId,renderCardButtons(session));
      else {
        await editReplyMarkup(userId,msgId,{inline_keyboard:[]});
        await sendMessage(userId,await getSpiritGuide()); markStep(userId,'spiritGuide');
        await sendMessage(userId,await getLuckyHints());  markStep(userId,'luckyHints');
        await sendMessage(userId,await getMoonAdvice());  markStep(userId,'moonAdvice');
        await sendMessage(userId,'✨ Unlock deeper guidance:',renderPremiumButtonsInline());
        markStep(userId,'premiumButtonsShown');
      }
    } catch(e) { await sendMessage(userId,`⚠️ ${e.message}`); }
    return;
  }
  // 高级模块点击+倒计时
  if(premiumHandlers[data]&&session.amount>=30) {
    session._premiumHandled=session._premiumHandled||new Set();
    if(session._premiumHandled.has(data)) return;
    session._premiumHandled.add(data);
    // 动态倒计时
    const hist=loadHistory[data]||[], avgMs=hist.length?hist.reduce((a,b)=>a+b,0)/hist.length:DEFAULT_MS;
    const secs=Math.ceil((avgMs+BUFFER_MS)/1000);
    // hide others:仅显示倒计时按钮
    await answerCb(cb.id,'',false);
    await editReplyMarkup(userId,msgId,{inline_keyboard:[[{text:`Fetching insight... ${secs}s`,callback_data:data}]]});
    let rem=secs;
    const iv=setInterval(async()=>{
      if(rem<=0) { clearInterval(iv); return; }
      rem--;
      try { await editReplyMarkup(userId,msgId,{inline_keyboard:[[{text:`Fetching insight... ${rem}s`,callback_data:data}]]}); }catch{};
    },1000);
    // 调用并记录
    const st=Date.now();
    let response;
    try { response=await premiumHandlers[data](userId); }
    catch(e){ clearInterval(iv); await sendMessage(userId,`⚠️ Failed to load: ${data}`); return; }
    const dur=Date.now()-st;
    loadHistory[data]=loadHistory[data]||[]; loadHistory[data].push(dur);
    clearInterval(iv);
    // 移除按钮
    await editReplyMarkup(userId,msgId,removeClickedButton(cb.message.reply_markup,data));
    // 发送内容
    const contentId=await sendMessage(userId,response);
    markPremiumClick(userId,data,response);
    // 发送目录
    const dirMarkup=renderDirectoryButtons(userId);
    await sendMessage(userId,'📂 Navigate modules:',dirMarkup);
    return;
  }
  // 点击目录导航
  if(data.startsWith('nav_')) {
    const key=data.replace('nav_','');
    const {responses}=getDirectoryData(userId);
    const content=responses[key]||'No content cached.';
    await answerCb(cb.id,'',false);
    // 编辑目录消息为内容+目录上下文
    const dirMarkup=renderDirectoryButtons(userId);
    await editMessageText(userId,msgId,content,dirMarkup);
  }
}
module.exports={handleTelegramUpdate};
