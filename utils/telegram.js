// v1.1.2
const { Telegraf } = require('telegraf');
const { getTarotButtons, handleDrawCard } = require('./tarot');
const { startSession } = require('./tarot-session');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

function sendMessage(userId, message) {
  return bot.telegram.sendMessage(userId, message, { parse_mode: 'Markdown' });
}

function sendTarotButtons(userId) {
  return bot.telegram.sendMessage(userId, '👇 Tap to reveal your Tarot Reading:', getTarotButtons());
}

function simulateButtonClick(userId, action) {
  const cardIndex = parseInt(action.split('_')[1]);
  const result = handleDrawCard(userId, cardIndex);
  return sendMessage(userId, result);
}

bot.on('callback_query', async (ctx) => {
  const action = ctx.callbackQuery.data;
  const userId = ctx.from.id;
  const result = handleDrawCard(userId, parseInt(action.split('_')[1]));
  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown(result);
});

bot.launch();

module.exports = {
  sendMessage,
  sendTarotButtons,
  simulateButtonClick
};
