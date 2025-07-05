// v1.1.3
require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { handleDrawCard } = require('./tarot');

const bot = new Telegraf(process.env.BOT_TOKEN);

// 👇 初始化全局标志，避免重复启动
if (!global.telegramStarted) {
  global.telegramStarted = false;
}

// 🧠 按钮回调逻辑
bot.action(/^card_\d+$/, async (ctx) => {
  try {
    const userId = ctx.from.id;
    const cardIndex = parseInt(ctx.callbackQuery.data.split('_')[1], 10);
    const card = await handleDrawCard(userId, cardIndex);
    if (card) {
      await ctx.reply(`🔮 You drew: ${card}`);
    } else {
      await ctx.reply('❌ Failed to draw card.');
    }
  } catch (err) {
    console.error('[ERROR] handleDrawCard failed:', err.message);
    await ctx.reply('❌ Error processing your card.');
  }
});

// 📨 发消息
async function sendMessage(userId, text) {
  return bot.telegram.sendMessage(userId, text, { parse_mode: 'Markdown' });
}

// 🎴 发送塔罗牌按钮
async function sendTarotButtons(userId) {
  const buttons = Markup.inlineKeyboard([
    Markup.button.callback('🔮 Draw Card 1', 'card_0'),
    Markup.button.callback('🔮 Draw Card 2', 'card_1'),
    Markup.button.callback('🔮 Draw Card 3', 'card_2'),
  ]);
  return bot.telegram.sendMessage(userId, '👇 Tap to reveal your Tarot Reading:', buttons);
}

// 🤖 模拟点击按钮（用于测试）
async function simulateButtonClick(userId, action) {
  try {
    const ctx = {
      from: { id: userId },
      callbackQuery: { data: action },
      reply: (msg) => bot.telegram.sendMessage(userId, msg),
    };
    await bot.handleUpdate({ callback_query: ctx.callbackQuery, from: ctx.from });
    console.log('[INFO] Simulate click success: OK');
  } catch (err) {
    console.error('[ERROR] Simulate click failed:', err.message);
  }
}

// ✅ 启动 bot（仅运行一次）
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
