// index.js - v1.1.9
import express from 'express';
import bodyParser from 'body-parser';
import { sendButtonMessage, handleCallbackQuery } from './utils/telegram.js';
import { startSession } from './utils/tarot-session.js';

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const { user_id, amount } = req.body;

  if (!user_id || !amount || amount < 10) {
    console.log(`⚠️ Invalid or low amount received: ${amount}`);
    return res.sendStatus(400);
  }

  console.log(`✅ Session started for ${user_id}`);
  await startSession(user_id);

  const message = '✨ Thank you for your payment. Please draw your cards:';
  await sendButtonMessage(user_id, message);
  res.sendStatus(200);
});

app.post('/callback', async (req, res) => {
  try {
    const { callback_query } = req.body;
    if (!callback_query) return res.sendStatus(200);

    await handleCallbackQuery(callback_query);
    res.sendStatus(200);
  } catch (error) {
    console.error('❌ Callback error:', error);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
