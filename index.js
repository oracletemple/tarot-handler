// v1.1.0
const express = require('express');
const bodyParser = require('body-parser');
const { handleDrawCard, sendTarotButtons } = require('./utils/telegram');
const { startSession } = require('./utils/tarot-session');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.callback_query) {
    try {
      await handleDrawCard(body.callback_query);
      return res.sendStatus(200);
    } catch (err) {
      console.error('[ERROR] handleDrawCard failed:', err.message);
      return res.sendStatus(500);
    }
  }

  res.sendStatus(200);
});

app.post('/simulate-click', async (req, res) => {
  const { chatId, cardIndex } = req.body;

  if (![0, 1, 2].includes(cardIndex)) {
    return res.status(400).send('Invalid cardIndex. Must be 0, 1, or 2.');
  }

  startSession(chatId); // 初始化 session
  await sendTarotButtons(chatId); // 发按钮

  const callbackQuery = {
    id: 'simulate_' + Date.now(),
    from: { id: chatId },
    message: { chat: { id: chatId } },
    data: ['draw_1', 'draw_2', 'draw_3'][cardIndex],
  };

  try {
    setTimeout(async () => {
      await handleDrawCard(callbackQuery);
    }, 2000);
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
