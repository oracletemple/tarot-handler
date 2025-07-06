// index.js - v1.1.8
const express = require('express');
const bodyParser = require('body-parser');
const { sendButtonMessage, handleCallbackQuery } = require('./utils/telegram');
const { startSession } = require('./utils/tarot-session');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

app.post('/webhook', async (req, res) => {
  const { user_id, amount } = req.body;

  if (!user_id || !amount) {
    return res.status(400).json({ error: 'Missing user_id or amount' });
  }

  console.log(`✅ Session started for ${user_id}`);
  await startSession(user_id);

  // 推送按钮消息
  await sendButtonMessage(user_id, '✨ Thank you for your payment. Please draw your cards:');
  res.json({ ok: true });
});

app.post('/', async (req, res) => {
  const body = req.body;

  if (body.callback_query) {
    await handleCallbackQuery(body.callback_query);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
