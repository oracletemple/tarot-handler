// B_telegram.js - v1.2.4

const { Telegraf } = require('telegraf');
const {
  startSession,
  getSession,
  getCard,
  isSessionComplete
} = require('./G_tarot-session');

const BOT_TOKEN = process.env.BOT_TOKEN;
const RECEIVER_ID = Number(process.env.RECEIVER_ID); // 7685088782

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Welcome to the Divine Oracle Bot 🌟');
});

// 🧪 测试入口 /test123 → 模拟 12 USDT 套餐
bot.command('test123', async (ctx) => {
  if (ctx.from.id !== RECEIVER_ID) return;
  startSession(ctx.from.id, 12);
  await ctx.reply(
    '🧙 Your divine reading begins...\nPlease choose your card:',
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '🃏 Card 1', callback_data: 'card_0' },
          { text: '🃏 Card 2', callback_data: 'card_1' },
          { text: '🃏 Card 3', callback_data: 'card_2' }
        ]]
      }
    }
  );
});

// 🧪 测试入口 /test30 → 模拟 30 USDT 高端套餐
bot.command('test30', async (ctx) => {
  if (ctx.from.id !== RECEIVER_ID) return;
  startSession(ctx.from.id, 30);
  await ctx.reply(
    '🧙 Your divine reading begins...\nPlease choose your card:',
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[
          { text: '🃏 Card 1', callback_data: 'card_0' },
          { text: '🃏 Card 2', callback_data: 'card_1' },
          { text: '🃏 Card 3', callback_data: 'card_2' }
        ]]
      }
    }
  );
});

// 处理按钮点击
bot.on('callback_query', async (ctx) => {
  const userId = ctx.from.id;
  const messageId = ctx.callbackQuery.message.message_id;
  const chatId = ctx.chat.id;
  const data = ctx.callbackQuery.data;

  try {
    const session = getSession(userId);
    if (!session) {
      return ctx.reply('⚠️ Session not found. Please try again later.');
    }

    const index = parseInt(data.split('_')[1], 10);
    if (session.drawn.includes(index)) {
      return ctx.answerCbQuery('You already drew this card.');
    }

    const card = getCard(userId, index);
    const amountText = session.amount ? `${session.amount} USDT` : 'N/A USDT';

    await ctx.replyWithMarkdown(`🔮 *${card.name}*\n${card.meaning}\n\n💰 You paid: ${amountText}`);

    if (isSessionComplete(userId)) {
      await ctx.telegram.editMessageReplyMarkup(chatId, messageId, null, {
        inline_keyboard: []
      });
    } else {
      await ctx.answerCbQuery('Card drawn!');
    }
  } catch (err) {
    console.error('❌ Callback error:', err.message);
    ctx.reply('❌ Error: ' + err.message);
  }
});

module.exports = bot;
