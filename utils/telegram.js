// v1.1.5
require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { handleDrawCard } = require('./tarot');

const bot = new Telegraf(process.env.BOT_TOKEN);
if (!global.telegramStarted) global.telegramStarted = false;

// ✅ 真正用户点击按钮时调用
bot.action(/^card_\d+$/, async (ctx) => {
  try {
    const userId = ctx.from?.id;
    const cardIndex = parseInt(ctx.callbackQuery.data.split('_')[1], 10);
    const card = await handleDrawCard(userId, cardIndex);
    if (card) {
      await ctx.reply(`🔮 You drew: ${card}`);
    } else {
      await ctx.reply('❌ Failed to draw card.');
    }
  } catch (err) {
    console.error('[ERROR] handleDrawCard failed:', err.message);
    try {
      await ctx.reply('❌ Error processing your card.');
    } catch {}
  }
});

// ✉️ 普通发送消息
async function sendMessage(userId, text) {
  return bot.telegram.sendMessage(userId, text, { parse_mode: 'Markdown' });
}

// 🎴 塔罗抽牌按钮
async function sendTarotButtons(userId) {
  const buttons = Markup.inlineKeyboard([
    Markup.button.callback('🔮 Draw Card 1', 'card_0'),
    Markup.button.callback('🔮 Draw Card 2', 'card_1'),
    Markup.button.callback('🔮 Draw Card 3', 'card_2'),
  ]);
  return bot.telegram.sendMessage(userId, '👇 Tap to reveal your Tarot Reading:', buttons);
}

// 🧪 模拟按钮点击：直接调用逻辑函数，不再伪造 ctx
async function simulateButtonClick(userId, action) {
  try {
    const index = parseInt(action.split('_')[1], 10);
    const card = await handleDrawCard(userId, index);
    if (card) {
      await sendMessage(userId, `🔮 You drew: ${card}`);
    } else {
      await sendMessage(userId, '❌ Failed to draw card.');
    }
    console.log(`[INFO] Simulate click success: ${action}`);
  } catch (err) {
    console.error('[ERROR] Simulate click failed:', err.message);
  }
}

// 🟢 启动 bot（只运行一次）
if (!global.telegramStarted) {
  bot.launch()
    .then(() => {
      console.log('[INFO] Telegram bot launched ✅');
      global.telegramStarted = true;
    })
    .catch((err) => {
      console.error('❌ Telegram launch failed:', err.message);
    });
}

module.exports = {
  sendMessage,
  sendTarotButtons,
  simulateButtonClick,
};
