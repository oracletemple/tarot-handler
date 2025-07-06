// index.js  // v1.1.8

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { sendButtonMessage } = require('./utils/telegram');
const { startSession } = require('./utils/tarot-session');
const { handleCallbackQuery } = require('./utils/telegram');

const app = express();
app.use(bodyParser.json());

const RECEIVER_ID = process.env.RECEIVER_ID;
const AMOUNT_THRESHOLD = parseFloat(process.env.AMOUNT_THRESHOLD || '10');

// Handle Webhook from Telegram or payment listener
app.post('/webhook', async (req, res) => {
  const body = req.body;

  // Handle Telegram button click (callback_query)
  if (body.callback_query) {
    await handleCallbackQuery(body.callback_query);
    return res.sendStatus(200);
  }

  // Handle payment notification (must contain user_id and amount)
  const { user_id, amount } = body;
  if (!user_id || !amount || amount < AMOUNT_THRESHOLD) {
    return res.status(400).send('Invalid payment');
  }

  // Start tarot session and push buttons
  startSession(user_id);
  await sendButtonMessage(user_id, '✨ Thank you for your payment. Please draw your cards:');
  res.sendStatus(200);
});

// Health check
app.get('/', (req, res) => {
  res.send('Tarot webhook active.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
