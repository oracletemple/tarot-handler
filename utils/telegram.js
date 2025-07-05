// v1.1.3
const { Telegraf } = require('telegraf');
const { getTarotButtons, handleDrawCard } = require('./tarot');
const { startSession } = require('./tarot-session');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// ✅ 避免重复启动（防止冲突）
if (!process.env.TELEGRAM_STARTED) {
  bot.launch().then(() => {
    console.log('✅ Telegram bot launched');
    process.env.TELEGRAM_STARTED = 'true';
  }).catch(err => {
    console.error('❌ Telegram launch failed:', err.message);
  });
}

// ✅ 按钮交互逻辑：处理点击 card_1、card_2、card_3
bot.on('callback_query', async (ctx) => {
  const action = ctx.callbackQuery.data;
  const userId = ctx.from.id;

  try {
    const result = handleDrawCard(userId, parseInt(action.split('_')[1]));
    await ctx.answerCbQuery();
    await ctx.replyWithMarkdown(result);
  } catch (error) {
    await ctx.answerCbQuery('⚠️ Failed to draw card.');
    await ctx.reply('❌ Failed to draw card.');
    console.error('[ERROR] handleDrawCard failed:', error.message);
  }
});

// ✅ 发消息
function sendMessage(userId, message) {
  return bot.telegram.sendMessage(userId, message, { parse_mode: 'Markdown' });
}

// ✅ 发出占卜按钮
function sendTarotButtons(userId) {
  return bot.telegram.sendMessage(userId, '👇 Tap to reveal your Tarot Reading:', getTarotButtons());
}

// ✅ 模拟按钮点击
function simulateButtonClick(userId, action) {
  const cardIndex = parseInt(action.split('_')[1]);
  const result = handleDrawCard(userId, cardIndex);
  return sendMessage(userId, result);
}

module.exports = {
  sendMessage,
  sendTarotButtons,
  simulateButtonClick
};
