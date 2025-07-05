// utils/telegram.js
// v1.1.6 - add safe launchOnce protection to prevent conflict

const { Telegraf, Markup } = require('telegraf');
const { startSession, getCard, isSessionComplete } = require('./tarot-session');
const { WALLET_ADDRESS, BOT_TOKEN } = process.env;

const bot = new Telegraf(BOT_TOKEN);

// 按钮 UI
function generateButtons(userId) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('🔮 Pick Card 1', `pick_${userId}_0`),
      Markup.button.callback('🔮 Pick Card 2', `pick_${userId}_1`),
      Markup.button.callback('🔮 Pick Card 3', `pick_${userId}_2`)
    ]
  ]);
}

// 发出选择按钮
async function sendTarotOptions(chatId, userId) {
  await bot.telegram.sendMessage(chatId, 'Please choose a card to begin your tarot reading:', generateButtons(userId));
}

// 发出抽牌结果
async function sendCardResult(chatId, card) {
  await bot.telegram.sendMessage(chatId, `🃏 Your card: *${card.name}*\n_${card.description}_`, {
    parse_mode: 'Markdown',
  });
}

// 注册按钮回调
bot.on('callback_query', async (ctx) => {
  try {
    const data = ctx.callbackQuery.data;
    const match = data.match(/^pick_(\d+)_([0-2])$/);
    if (!match) return;

    const userId = match[1];
    const cardIndex = parseInt(match[2], 10);

    await ctx.answerCbQuery(); // 反馈已响应
    const card = getCard(userId, cardIndex);

    await sendCardResult(ctx.chat.id, card);

    if (isSessionComplete(userId)) {
      await bot.telegram.sendMessage(ctx.chat.id, '✨ You have completed your reading. Thank you!');
    }
  } catch (err) {
    console.error('[ERROR] Telegram callback error:', err);
  }
});

// ✅ 安全启动封装：防止重复 bot.launch()，且更稳定
function launchOnce() {
  if (global.__telegram_bot_launched__) {
    console.log('⚠️ Telegram bot already launched, skipping...');
    return;
  }
  bot.launch().then(() => {
    global.__telegram_bot_launched__ = true;
    console.log('✅ Telegram bot launched');
  }).catch((err) => {
    console.error('❌ Telegram launch failed:', err);
  });
}

// 调用安全启动
launchOnce();

// 导出模块
module.exports = {
  sendTarotOptions,
  sendCardResult,
};
