// index.js  // v1.1.9

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const {
  sendButtonMessage,
  handleCallbackQuery
} = require('./utils/telegram');
const { startSession } = require('./utils/tarot-session');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const THRESHOLD = parseFloat(process.env.AMOUNT_THRESHOLD || 10);
const RECEIVER_ID = process.env.RECEIVER_ID;

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  const { user_id, amount, data } = req.body;

  // 如果是按钮回调请求
  if (data) {
    await handleCallbackQuery(user_id, data);
    return res.sendStatus(200);
  }

  // 如果是付款请求
  if (user_id && amount && amount >= THRESHOLD) {
    console.log(`✅ Session started for ${user_id}`);
    await startSession(user_id);

    const message = '✨ Thank you for your payment. Please draw your cards:';
    await sendButtonMessage(user_id, message);
    return res.sendStatus(200);
  }

  console.warn(`⚠️ Invalid or low amount received: ${amount}`);
  res.sendStatus(400);
});

// Root route
app.get('/', (req, res) => {
  res.send('🧙 Tarot Webhook is active.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
