// utils/telegram.js · v1.1.5
const { Telegraf } = require('telegraf');
const { createWebhook } = require('telegraf/lib/server/express');

const bot = new Telegraf(process.env.BOT_TOKEN);

// ➕ 可根据需要添加 bot.command 或 bot.action 等指令
bot.start((ctx) => ctx.reply('🔮 Welcome to the Tarot Bot!'));
bot.hears(/hi|hello/i, (ctx) => ctx.reply('👋 Hello! Ask me for a tarot reading.'));

const webhookCallback = createWebhook(bot);

bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}`).then(() => {
  console.log('✅ Webhook set:', process.env.WEBHOOK_URL);
}).catch(console.error);

module.exports = { bot, webhookCallback };
