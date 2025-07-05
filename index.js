// index.js · v1.1.5

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { processTransaction } = require('./utils/processor');
const { simulateClick } = require('./utils/simulate-click');
const { initTelegramBot } = require('./utils/telegram');
const testTransactions = require('./utils/test-transactions');

const app = express();
app.use(bodyParser.json());

// --- Webhook 入口 ---
app.post('/webhook', async (req, res) => {
  const tx = req.body;
  if (!tx || !tx.amount || !tx.hash) {
    return res.status(400).json({ error: 'Invalid transaction data' });
  }

  try {
    await processTransaction(tx);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('[ERROR] Webhook processing failed:', err.message);
    res.status(500).json({ error: 'Processing failed' });
  }
});

// --- 启动 Telegram Bot ---
if (!global.telegramStarted) {
  initTelegramBot();
  global.telegramStarted = true;
}

// --- 启动服务器 ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Tarot Webhook Server running at http://localhost:${PORT}`);
});

// --- 仅首次部署时运行模拟测试 ---
if (!global.testedOnce) {
  const runTest = async () => {
    global.testedOnce = true;
    await testTransactions(simulateClick);
    console.log('[INFO] Test mode complete. Now entering live mode.');
  };
  runTest();
}
