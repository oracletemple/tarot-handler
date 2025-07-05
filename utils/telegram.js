// v1.1.4
require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { handleDrawCard } = require('./tarot');

const bot = new Telegraf(process.env.BOT_TOKEN);

if (!global.telegramStarted) global.telegramStarted = false;

// 🎯 按钮点击处理
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
    } catch (e) {
      console.error('[ERROR] Fallback reply failed:', e.message);
    }
  }
});

// 📤 普通消息发送
async function sendMessage(userId, text) {
  return bot.telegram.sendMessage(userId, text, { parse_mode: 'Markdown' });
}

// 🔮 塔罗按钮
async function sendTarotButtons(userId) {
  const buttons = Markup.inlineKeyboard([
    Markup.button.callback('🔮 Draw Card 1', 'card_0'),
    Markup.button.callback('🔮 Draw Card 2', 'card_1'),
    Markup.button.callback('🔮 Draw Card 3', 'card_2'),
  ]);
  return bot.telegram.sendMessage(userId, '👇 Tap to reveal your Tarot Reading:', buttons);
}

// 🧪 模拟按钮点击（用于自动化测试）
async function simulateButtonClick(userId, action) {
  try {
    const mockCtx = {
      from: { id: userId },
      callbackQuery: { data: action, from: { id: userId } },
      reply: (msg) => bot.telegram.sendMessage(userId, msg),
    };
    await bot.middleware()(mockCtx, () => {});
    console.log('[INFO] Simulate click success: OK');
  } catch (err) {
    console.error('[ERROR] Simulate click failed:', err.message);
  }
}

// 🛡️ 启动 bot
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
