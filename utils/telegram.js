// utils/telegram.js
// v1.1.3 - 修复 getUpdates 冲突、模拟按钮点击失败、基础与高阶逻辑统一

const { Telegraf } = require('telegraf');
const express = require('express');
const { getCard, isSessionComplete, startSession } = require('./tarot-session');
const tarot = require('./tarot');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();
app.use(express.json());

// ✅ 防止重复执行 bot.launch()
if (!global.telegramStarted) {
  bot.launch().then(() => {
    console.log('✅ Telegram Bot started');
    global.telegramStarted = true;
  }).catch((err) => {
    console.error('❌ Telegram launch failed:', err.message);
  });
}

// 📩 发送普通消息
async function sendMessage(userId, text) {
  await bot.telegram.sendMessage(userId, text, { parse_mode: 'Markdown' });
}

// 📮 发送塔罗按钮
async function sendTarotButtons(userId) {
  await bot.telegram.sendMessage(userId, '👇 Tap to reveal your Tarot Reading:', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔮 Card 1', callback_data: 'card_1' },
          { text: '🔮 Card 2', callback_data: 'card_2' },
          { text: '🔮 Card 3', callback_data: 'card_3' }
        ]
      ]
    }
  });
}

// 🎯 按钮点击响应逻辑
bot.on('callback_query', async (ctx) => {
  try {
    const userId = ctx.from.id;
    const data = ctx.callbackQuery.data;

    if (!['card_1', 'card_2', 'card_3'].includes(data)) return;

    const index = parseInt(data.split('_')[1]);
    const card = getCard(userId, index);

    if (!card) {
      await ctx.answerCbQuery('❌ Failed to draw card.');
      return;
    }

    await ctx.reply(`🔮 You drew: ${card.name}\n${tarot.getMeaning(card)}`);
    await ctx.answerCbQuery();
  } catch (err) {
    console.error('[ERROR] handleDrawCard failed:', err.message);
    if (ctx.answerCbQuery) await ctx.answerCbQuery('❌ Failed to draw card.');
  }
});

// 🔁 支持模拟点击接口（用于自动测试）
app.post('/simulate-click', async (req, res) => {
  const { userId, buttonId } = req.body;
  if (!userId || !buttonId) return res.status(400).send('Missing parameters');

  try {
    const index = parseInt(buttonId.split('_')[1]);
    const card = getCard(userId, index);

    if (!card) return res.status(500).send('No card found');

    await sendMessage(userId, `🔮 You drew: ${card.name}\n${tarot.getMeaning(card)}`);
    res.send('OK');
  } catch (err) {
    console.error('[ERROR] Simulate click failed:', err.message);
    res.status(500).send(err.message);
  }
});

// 🚀 启动 webhook 服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Tarot Webhook Server running at http://localhost:${PORT}`);
});

module.exports = {
  sendMessage,
  sendTarotButtons,
  simulateButtonClick: async (userId, buttonId) => {
    try {
      await axios.post(`http://localhost:${PORT}/simulate-click`, { userId, buttonId });
    } catch (err) {
      console.error('[ERROR] Simulate click failed:', err.message);
    }
  }
};
