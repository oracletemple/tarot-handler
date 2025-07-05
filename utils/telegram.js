// utils/telegram.js
// v1.1.5 - Added global.telegramStarted protection

const { Telegraf, Markup } = require('telegraf');
const { startSession, getCard, isSessionComplete } = require('./tarot-session');
const { WALLET_ADDRESS, BOT_TOKEN } = process.env;

const bot = new Telegraf(BOT_TOKEN);

// 样式按钮生成
function generateButtons(userId) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('🔮 Pick Card 1', `pick_${userId}_0`),
      Markup.button.callback('🔮 Pick Card 2', `pick_${userId}_1`),
      Markup.button.callback('🔮 Pick Card 3', `pick_${userId}_2`)
    ]
  ]);
}

// 发送三张塔罗牌选择按钮
async function sendTarotOptions(chatId, userId) {
  await bot.telegram.sendMessage(chatId, 'Please choose a card to begin your tarot reading:', generateButtons(userId));
}

// 发送抽牌结果（可扩展图像等）
async function sendCardResult(chatId, card) {
  await bot.telegram.sendMessage(chatId, `🃏 Your card: *${card.name}*\n_${card.description}_`, { parse_mode: 'Markdown' });
}

// 注册互动逻辑
bot.on('callback_query', async (ctx) => {
  try {
    const data = ctx.callbackQuery.data;
    const match = data.match(/^pick_(\d+)_([0-2])$/);
    if (!match) return;

    const userId = match[1];
    const cardIndex = parseInt(match[2], 10);

    await ctx.answerCbQuery(); // 优化用户体验
    const card = getCard(userId, cardIndex);

    await sendCardResult(ctx.chat.id, card);

    if (isSessionComplete(userId)) {
      await bot.telegram.sendMessage(ctx.chat.id, '✨ You have completed your reading. Thank you!');
    }
  } catch (err) {
    console.error('[ERROR] Telegram callback error:', err);
  }
});

// ✅ 启动保护：防止重复 bot.launch()
if (!global.telegramStarted) {
  bot.launch();
  global.telegramStarted = true;
  console.log('✅ Telegram bot launched');
}

// 导出主接口
module.exports = {
  sendTarotOptions,
  sendCardResult,
};
