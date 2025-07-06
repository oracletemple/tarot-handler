// v1.1.9
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { startSession } = require('./utils/tarot-session');
const { sendButtonMessage, handleCallbackQuery } = require('./utils/telegram');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.message) {
    return res.sendStatus(200);
  }

  if (body.callback_query) {
    await handleCallbackQuery(body.callback_query);
    return res.sendStatus(200);
  }

  const { user_id, amount } = body;

  if (!user_id || amount < 10) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  await startSession(user_id);
  await sendButtonMessage(user_id, '✨ Thank you for your payment. Please draw your cards:');

  res.json({ status: 'ok' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
