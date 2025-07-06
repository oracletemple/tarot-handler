// index.js  // v1.1.8

const express = require('express');
const bodyParser = require('body-parser');
const { handleCallbackQuery, sendButtonMessage } = require('./utils/telegram');
const { startSession } = require('./utils/tarot-session');

const app = express();
app.use(bodyParser.json());

// 🧠 Webhook 接收交易（模拟或真实监听）
app.post('/webhook', async (req, res) => {
  const { user_id, amount } = req.body;

  if (!user_id || !amount) {
    return res.status(400).json({ error: 'Missing user_id or amount' });
  }

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount < 10) {
    return res.status(200).json({ message: 'Ignored low amount' });
  }

  console.log(`✅ Session started for ${user_id}`);
  await startSession(user_id);
  await sendButtonMessage(user_id, '✨ Thank you for your payment. Please draw your cards:');

  res.status(200).json({ message: 'Session started and message sent' });
});

// 🎯 Telegram 按钮点击处理
app.post('/webhook', async (req, res) => {
  if (req.body.callback_query) {
    await handleCallbackQuery(req.body.callback_query);
  }
  res.sendStatus(200);
});

// ✅ 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
