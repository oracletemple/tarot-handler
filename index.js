// 📁 tarot-handler/index.js
// v1.2.0 - 移除模拟交易 + 支持逐张抽逐张清除按钮

import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { sendButtonMessage, handleCallbackQuery } from './utils/telegram.js';
import { startSession } from './utils/tarot-session.js';

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const { user_id, amount } = req.body;

  if (!user_id || !amount) {
    console.log('⚠️ Missing user_id or amount');
    return res.status(400).send('Missing parameters');
  }

  console.log(`✅ Received ${amount} USDT from ${user_id}`);

  if (amount >= 10) {
    // 开启 session
    startSession(user_id);

    // 推送按钮（Card 1 / 2 / 3）
    await sendButtonMessage(user_id);

    return res.status(200).send('OK');
  } else {
    console.log(`⚠️ Received ${amount} USDT, which is below the minimum threshold.`);
    return res.status(200).send('Ignored');
  }
});

app.post('/callback', async (req, res) => {
  try {
    const body = req.body;
    await handleCallbackQuery(body);
    res.status(200).send('Callback handled');
  } catch (err) {
    console.error('❌ Error handling callback:', err);
    res.status(500).send('Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
