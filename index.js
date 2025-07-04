// ✅ Web Service: tarot-handler/index.js (v1.1.0)
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { handleDrawCard } = require('./utils/telegram');

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

// ✅ 按钮互动回调处理
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

app.get('/', (req, res) => {
  res.send('Tarot Webhook Server is running.');
});

app.listen(PORT, () => {
  console.log(`🚀 Tarot Webhook Server running at http://localhost:${PORT}`);
});


// ✅ Background Worker: usdt-listener/index.js (v1.1.0)
require('dotenv').config();
const axios = require('axios');
const { sendMessage, sendTarotButtons, simulateButtonClick } = require('./utils/telegram');
const { startSession } = require('./utils/tarot-session');

const wallet = process.env.WALLET_ADDRESS;
const userId = process.env.RECEIVER_ID;
const amountThreshold = parseFloat(process.env.AMOUNT_THRESHOLD || '12');
const webhookUrl = process.env.WEBHOOK_URL;

const notifiedTxs = new Set();
let testCount = 0;
let testMode = true;

const testTransactions = [
  { amount: 12, hash: 'test_tx_001' },
  { amount: 12, hash: 'test_tx_002' },
  { amount: 12, hash: 'test_tx_003' },
  { amount: 30, hash: 'test_tx_004' },
  { amount: 30, hash: 'test_tx_005' },
  { amount: 30, hash: 'test_tx_006' }
];

async function handleTransaction({ amount, hash, isSuccess = true }) {
  if (notifiedTxs.has(hash)) return;
  notifiedTxs.add(hash);

  let message = `💸 Payment ${isSuccess ? 'received' : 'failed'}:\n\n`;
  message += `💰 Amount: ${amount} USDT (TRC20)\n`;
  message += `🔗 Tx Hash: ${hash}\n`;

  if (!isSuccess) {
    message += `\n⚠️ Transaction failed. Please verify on-chain status.`;
  } else if (amount >= 29.9) {
    message += `\n🧠 You have unlocked the *Custom Oracle Reading*.`;
    message += `\nPlease reply with your question – we will begin your spiritual decoding.`;
    message += `\n\n🔮 Bonus: You also receive a 3-card Tarot Reading below:`;
  } else if (amount >= amountThreshold) {
    message += `\n🔮 Please focus your energy and draw 3 cards...`;
    message += `\n👇 Tap the buttons to reveal your Tarot Reading:`;
  } else {
    message += `\n⚠️ Payment below minimum threshold (${amountThreshold} USDT). It will not be processed.`;
  }

  if (testMode) {
    message = `🧪 [TEST MODE]\n\n` + message;
  }

  try {
    await sendMessage(userId, message);
    if (amount >= amountThreshold) {
      startSession(userId);
      await sendTarotButtons(userId);
    }

    if (['test_tx_001', 'test_tx_002', 'test_tx_004', 'test_tx_005'].includes(hash)) {
      await axios.post(`${webhookUrl}/webhook`, {
        callback_query: {
          id: 'simulate_' + Date.now(),
          from: { id: userId },
          message: { chat: { id: userId } },
          data: 'card_3'
        }
      });
    }
    console.log('[INFO] Message sent to Telegram ✅');
  } catch (err) {
    console.error('[ERROR] Failed to send message:', err.message);
  }
}

const testInterval = setInterval(() => {
  if (testCount < testTransactions.length) {
    handleTransaction(testTransactions[testCount]);
    testCount++;
  } else {
    clearInterval(testInterval);
    testMode = false;
  }
}, 1000);
