require('./utils/keep-alive');

// 📁 index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { handleDrawCard, sendTarotButtons } = require('./utils/telegram');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('🔮 Tarot Webhook is running');
});

app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.message && body.message.text) {
    const userId = body.message.chat.id;
    if (body.message.text.toLowerCase().includes('draw')) {
      await sendTarotButtons(userId);
    }
  }

  if (body.callback_query) {
    const callback = body.callback_query;
    const userId = callback.from.id;
    const data = callback.data;
    await handleDrawCard(userId, data);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🚀 Tarot Webhook Server running at http://localhost:${PORT}`);
});
