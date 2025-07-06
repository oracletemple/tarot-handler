// index.js - v1.1.9
import express from 'express';
import bodyParser from 'body-parser';
import { sendButtonMessage } from './utils/telegram.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const { user_id, amount } = req.body;

  if (!user_id || !amount) {
    console.warn('⚠️ Missing user_id or amount');
    return res.status(400).send('Missing user_id or amount');
  }

  if (amount >= 10) {
    console.log(`✅ Received ${amount} USDT from ${user_id}`);
    await sendButtonMessage(user_id, amount);
  } else {
    console.warn(`⚠️ Invalid or low amount received: ${amount}`);
  }

  res.send('OK');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
