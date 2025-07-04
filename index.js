// index.js - tarot-handler (v1.0.7)

const express = require('express');
const bodyParser = require('body-parser');
const { handleDrawCard } = require('./utils/telegram');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// ✅ Webhook for Telegram button interaction
app.post('/webhook', async (req, res) => {
  const body = req.body;
  if (body.callback_query) {
    try {
      await handleDrawCard(body.callback_query);
      return res.sendStatus(200);
    } catch (err) {
      console.error('[ERROR] handleDrawCard failed:', err);
      return res.sendStatus(500);
    }
  }
  res.sendStatus(200);
});

// ✅ Simulate button click via API (for remote trigger)
app.post('/simulate-click', async (req, res) => {
  const { chatId, cardIndex } = req.body;
  if (![0, 1, 2].includes(cardIndex)) {
    return res.status(400).send('Invalid cardIndex');
  }
  const callbackQuery = {
    id: 'simulate_' + Date.now(),
    from: { id: chatId },
    message: { chat: { id: chatId } },
    data: ['draw_1', 'draw_2', 'draw_3'][cardIndex],
  };
  try {
    await handleDrawCard(callbackQuery);
    res.send({ ok: true, message: 'Simulated card draw sent.' });
  } catch (err) {
    console.error('[ERROR] Simulate button click failed:', err.message);
    res.status(500).send({ ok: false, error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Tarot Webhook Server is running.');
});

app.listen(PORT, () => {
  console.log(`🚀 Tarot Webhook Server running at http://localhost:${PORT}`);
});
