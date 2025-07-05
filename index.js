// v1.0.11
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { handleDrawCard } = require('./utils/tarot');
const { sendMessage } = require('./utils/telegram');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const query = req.body.callback_query;
  const userId = query.from.id;
  const data = query.data;

  const cardIndex = {
    'card_1': 0,
    'card_2': 1,
    'card_3': 2
  }[data];

  if (cardIndex !== undefined) {
    try {
      await handleDrawCard(userId, cardIndex);
    } catch (err) {
      console.error('[ERROR] handleDrawCard failed:', err.message);
    }
  }

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('🚀 Tarot Webhook Server running at http://localhost:3000');
});
