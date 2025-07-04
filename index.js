// v1.0.11
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const { sendTarotButtons, sendCustomReading } = require('./utils/telegram');
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const AMOUNT_THRESHOLD = parseFloat(process.env.AMOUNT_THRESHOLD || '10');

let testModeExecuted = false;

app.post('/webhook', async (req, res) => {
  const tx = req.body;

  const userId = process.env.RECEIVER_ID;
  const amount = parseFloat(tx.amount);

  try {
    if (amount >= 30) {
      await sendCustomReading(userId, tx.hash, amount, true);
    } else if (amount >= AMOUNT_THRESHOLD) {
      await sendTarotButtons(userId, tx.hash, true);
    }
    res.sendStatus(200);
  } catch (err) {
    console.error('[ERROR] Failed to process webhook:', err.message);
    res.sendStatus(500);
  }
});

app.get('/simulate-click', async (req, res) => {
  const { userId, index } = req.query;
  try {
    const clickRes = await axios.post(`${WEBHOOK_URL}/draw-card`, {
      userId,
      index: parseInt(index, 10),
    });
    res.send(`Simulate click success: ${clickRes.statusText}`);
  } catch (err) {
    console.error('[ERROR] Simulate click failed:', err.message);
    res.status(500).send(err.message);
  }
});

app.listen(PORT, async () => {
  console.log(`🚀 Tarot Webhook Server running at http://localhost:${PORT}`);

  if (!testModeExecuted) {
    testModeExecuted = true;
    console.log('[TEST] Running testTransactions...');

    const txs = [
      { hash: 'test_tx_001', amount: 12 },
      { hash: 'test_tx_002', amount: 12 },
      { hash: 'test_tx_003', amount: 12 },
      { hash: 'test_tx_004', amount: 30 },
      { hash: 'test_tx_005', amount: 30 },
      { hash: 'test_tx_006', amount: 30 },
    ];

    for (let i = 0; i < txs.length; i++) {
      const tx = txs[i];
      try {
        const userId = process.env.RECEIVER_ID;
        if (tx.amount >= 30) {
          await sendCustomReading(userId, tx.hash, tx.amount, true);
        } else {
          await sendTarotButtons(userId, tx.hash, true);
        }
        console.log(`[INFO] Message sent for ${tx.hash}`);
      } catch (e) {
        console.error(`[ERROR] Failed to send for ${tx.hash}:`, e.message);
      }

      // 只模拟前两个点击
      if ((i === 0 || i === 1 || i === 3 || i === 4)) {
        try {
          const clickIndex = i % 3; // 模拟点击三张牌之一
          await axios.get(`${WEBHOOK_URL}/simulate-click`, {
            params: { userId: process.env.RECEIVER_ID, index: clickIndex },
          });
        } catch (e) {
          console.error('[ERROR] Simulate click failed:', e.message);
        }
      }
    }

    console.log('[INFO] Test mode complete. Now entering live mode.');
  }
});
