// v1.1.8
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { startSession } = require('./utils/tarot-session');
const { handleCallbackQuery, sendButtonMessage } = require('./utils/telegram');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const { user_id, amount } = req.body;

  if (!user_id || !amount || amount < parseFloat(process.env.AMOUNT_THRESHOLD)) {
    return res.sendStatus(400);
  }

  console.log(`✅ Session started for ${user_id}`);
  startSession(user_id);
  await sendButtonMessage(user_id, '✨ Thank you for your payment. Please draw your cards:');
  res.sendStatus(200);
});

app.post('/', handleCallbackQuery);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
