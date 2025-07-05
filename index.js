// index.js (Webhook 版) · v1.1.5

require('dotenv').config();
const express = require('express');
const bot = require('./utils/telegram');

const app = express();
app.use(express.json());

// 设置 Telegram Webhook
const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_PATH = `/bot${BOT_TOKEN}`;

app.use(TELEGRAM_PATH, bot.webhookCallback());

app.get('/', (req, res) => {
  res.send('Tarot Handler Webhook is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Tarot Webhook Server running at http://localhost:${PORT}`);
  try {
    const webhookUrl = process.env.RENDER_EXTERNAL_URL || `https://tarot-handler.onrender.com${TELEGRAM_PATH}`;
    await bot.telegram.setWebhook(webhookUrl);
    console.log(`📡 Webhook set to: ${webhookUrl}`);
  } catch (err) {
    console.error('❌ Failed to set webhook:', err);
  }
});
