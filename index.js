// v1.1.4
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { sendTarotButtons, handleDrawCard, sendCustomReadingPrompt } = require('./utils/telegram');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
let testExecuted = false;

// Telegram webhook
app.post('/webhook', async (req, res) => {
  const msg = req.body.message;
  const callback = req.body.callback_query;

  if (msg) {
    const chatId = msg.chat.id;
    if (msg.text && msg.text.toLowerCase().includes('/start')) {
      await sendTarotButtons(chatId);
    }
  }

  if (callback) {
    const chatId = callback.message.chat.id;
    const data = callback.data;
    if (data.startsWith('draw_')) {
      const index = parseInt(data.split('_')[1], 10);
      try {
        await handleDrawCard(chatId, index);
      } catch (err) {
        console.error('[ERROR]', err.message);
      }
    }
  }

  res.sendStatus(200);
});

// 测试交易模拟，仅执行一次
async function testTransactions() {
  if (testExecuted) return;
  testExecuted = true;

  const testTxs = [
    { hash: 'test_tx_001', amount: 12 },
    { hash: 'test_tx_002', amount: 12 },
    { hash: 'test_tx_003', amount: 12 },
    { hash: 'test_tx_004', amount: 30 },
    { hash: 'test_tx_005', amount: 30 },
    { hash: 'test_tx_006', amount: 30 }
  ];

  for (const tx of testTxs) {
    await axios.post(`${process.env.WEBHOOK_URL}`, {
      message: {
        chat: { id: process.env.RECEIVER_ID },
        text: `[TEST] Simulated Tx: ${tx.hash} -> ${tx.amount} USDT`
      }
    });
    console.log(`[INFO] Message sent for ${tx.hash}`);

    if (['test_tx_001', 'test_tx_002', 'test_tx_004', 'test_tx_005'].includes(tx.hash)) {
      const cardIndex = tx.amount === 12 ? (tx.hash.endsWith('001') ? 0 : 1) : (tx.hash.endsWith('004') ? 0 : 1);
      await axios.post(`${process.env.WEBHOOK_URL}`, {
        callback_query: {
          message: { chat: { id: process.env.RECEIVER_ID } },
          data: `draw_${cardIndex}`
        }
      }).then(() => {
        console.log('[INFO] Simulate click success: OK');
      }).catch(err => {
        console.error('[ERROR] Simulate click failed:', err.message);
      });
    }
  }

  console.log('[INFO] Test mode complete. Now entering live mode.');
}

// 启动服务
app.listen(PORT, async () => {
  console.log(`🚀 Tarot Webhook Server running at http://localhost:${PORT}`);
  await testTransactions();
});
