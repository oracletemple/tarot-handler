// v1.1.4
require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const { handleDrawCard } = require('./tarot');
const { isSessionComplete } = require('./tarot-session');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Welcome! You will receive your divine message soon.');
});

bot.on('callback_query', async (ctx) => {
  try {
    const userId = ctx.from.id;
    const data = ctx.callbackQuery.data;

    if (data.startsWith('card_')) {
      const cardIndex = parseInt(data.split('_')[1]);
      if (!isSessionComplete(userId)) {
        await handleDrawCard(userId, cardIndex, ctx);
      }
    }
  } catch (err) {
    console.error('[ERROR] handleDrawCard failed:', err.message);
    console.error('Unhandled error while processing', ctx.update.callback_query);
  }
});

if (!global.telegramStarted) {
  bot.launch();
  global.telegramStarted = true;
  console.log('✅ Telegram bot launched');
} else {
  console.log('ℹ️ Telegram bot already started');
}

module.exports = bot;
