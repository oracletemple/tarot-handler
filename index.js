// v1.1.2
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { sendMessage, sendTarotButtons, simulateButtonClick, handleDrawCard } = require('./utils/telegram');
const { startSession } = require('./utils/tarot-session');

const app = express();
app.use(bodyParser.json());

const userId = process.env.RECEIVER_ID;
const amountThreshold = parseFloat(process.env.AMOUNT_THRESHOLD || '12');
const isTestMode = true;

// 🧪 一次性模拟交易（仅首次运行）
const testTransactions = [
  { amount: 12, hash: 'test_tx_001' },
  { amount: 12, hash: 'test_tx_002' },
  { amount: 12, hash: 'test_tx_003' },
  { amount: 30, hash: 'test_tx_004' },
  { amount: 30, hash: 'test_tx_005' },
  { amount: 30, hash: 'test_tx_006' },
];

let testExecuted = false;

async function handleTransaction({ amount, hash }) {
  let message = `💸 Payment received:\n\n💰 Amount: ${amount} USDT (TRC20)\n🔗 Tx Hash: ${hash}\n`;

  if (amount >= 29.9) {
    message += `\n🧠 You have unlocked the *Custom Oracle Reading*.\nPlease reply with your question – we will begin your spiritual decoding.\n\n🔮 Bonus: You also receive a 3-card Tarot Reading below:`;
  } else if (amount >= amountThreshold) {
    message += `\n🔮 Please focus your energy and draw 3 cards...\n👇 Tap the buttons to reveal your Tarot Reading:`;
  } else {
    message += `\n⚠️ Payment below minimum threshold (${amountThreshold} USDT).`;
  }

  if (isTestMode) message = `🧪 TEST MODE\n\n` + message;

  await sendMessage(userId, message);
  if (amount >= amountThreshold) {
    startSession(userId);
    await sendTarotButtons(userId);
  }

  // 模拟点击（仅指定交易）
  const shouldSimulate = ['test_tx_001', 'test_tx_002', 'test_tx_004', 'test_tx_005'].includes(hash);
  if (shouldSimulate) {
    setTimeout(() => {
      simulateButtonClick(userId, 'card_3');
    }, 3000);
  }

  console.log(`[INFO] Message sent for ${hash}`);
}

// ✅ simulate-click 接口
app.post('/simulate-click', async (req, res) => {
  const { userId, buttonId } = req.body;
  try {
    await handleDrawCard(userId, buttonId);
    return res.json({ ok: true, message: 'Simulated card draw sent.' });
  } catch (err) {
    console.error(`[ERROR] Simulate click failed: ${err.message}`);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// ✅ webhook 接口（备用）
app.post('/webhook', async (req, res) => {
  const { message, callback_query } = req.body;
  if (callback_query) {
    const userId = callback_query.from.id;
    const buttonId = callback_query.data;
    try {
      await handleDrawCard(userId, buttonId);
    } catch (e) {
      console.error(`[ERROR] handleDrawCard failed: ${e.message}`);
    }
  }
  res.sendStatus(200);
});

// ✅ 启动服务并执行一次模拟测试
app.listen(3000, async () => {
  console.log(`🚀 Tarot Webhook Server running at http://localhost:3000`);

  if (!testExecuted) {
    for (const tx of testTransactions) {
      await handleTransaction(tx);
    }
    testExecuted = true;
    console.log(`[INFO] Test mode complete. Now entering live mode.`);
  }
});
