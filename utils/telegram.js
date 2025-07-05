// v1.1.5
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios'); // ✅ 修复 axios 未定义

const BOT_TOKEN = process.env.BOT_TOKEN;
const RECEIVER_ID = process.env.RECEIVER_ID;

const bot = new Telegraf(BOT_TOKEN);

// 避免重复 launch 冲突（如多服务部署时）
if (!global.telegramStarted) {
  bot.launch().then(() => {
    console.log('✅ Telegram bot launched');
    global.telegramStarted = true;
  }).catch((err) => {
    console.error('❌ Telegram launch failed:', err.message);
  });
}

function sendTarotMessage({ amount, txid, tier }) {
  let message = `💸 Payment received:\n\n💰 Amount: ${amount} USDT\n🔗 Tx Hash: ${txid}`;

  if (tier === 'basic') {
    message += `\n\n✨ You unlocked Divine Oracle Basic.\nReceive a 3-card Tarot Reading below:`;
  } else if (tier === 'custom') {
    message += `\n\n🧠 You unlocked Custom Oracle Reading.\nPlease reply with your question.\n\n🔮 Also receive a 3-card Tarot Reading:`;
  }

  const buttons = [
    Markup.button.callback('🃏 Draw Card 1', 'card_1'),
    Markup.button.callback('🃏 Draw Card 2', 'card_2'),
    Markup.button.callback('🃏 Draw Card 3', 'card_3'),
  ];

  bot.telegram.sendMessage(RECEIVER_ID, message, {
    reply_markup: Markup.inlineKeyboard(buttons, { columns: 1 }),
  }).then(() => {
    console.log('[INFO] Message sent for', txid);
  }).catch(err => {
    console.error('[ERROR] Failed to send message:', err.message);
  });
}

function simulateButtonClick(userId, buttonIndex) {
  const button = `card_${buttonIndex}`;
  return axios.post('http://localhost:3000/simulate-click', {
    userId,
    callbackData: button,
  }).then(() => {
    console.log('[INFO] Simulate click success:', button);
  }).catch(err => {
    console.error('[ERROR] Simulate click failed:', err.message);
  });
}

module.exports = {
  bot,
  sendTarotMessage,
  simulateButtonClick,
};
