// v1.1.9
const express = require('express');
const bodyParser = require('body-parser');
const { sendButtonMessage, handleCallbackQuery } = require('./utils/telegram.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.message && body.message.successful_payment) {
    const userId = body.message.chat.id;
    const amount = body.message.successful_payment.total_amount / 100;
    await sendButtonMessage(userId, amount);
  }

  if (body.callback_query) {
    await handleCallbackQuery(body.callback_query);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
