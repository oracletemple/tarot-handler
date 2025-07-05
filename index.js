// index.js
// v1.1.3 - 每次部署仅执行一次模拟交易测试，基础与高端一致交互，按钮抽牌支持
require('dotenv').config();
const axios = require('axios');
const { sendMessage, sendTarotButtons, simulateButtonClick } = require('./utils/telegram');
const { startSession } = require('./utils/tarot-session');

const wallet = process.env.WALLET_ADDRESS;
const userId = process.env.RECEIVER_ID;
const amountThreshold = parseFloat(process.env.AMOUNT_THRESHOLD || '10');

const notifiedTxs = new Set();
let testCount = 0;
let testMode = true;

// ✅ 模拟交易列表（仅运行一次）
const testTransactions = [
  { amount: 12, hash: 'test_tx_001' },
  { amount: 12, hash: 'test_tx_002' },
  { amount: 12, hash: 'test_tx_003' },
  { amount: 30, hash: 'test_tx_004' },
  { amount: 30, hash: 'test_tx_005' },
  { amount: 30, hash: 'test_tx_006' },
];

// 🌟 主处理逻辑
async function handleTransaction({ amount, hash, isSuccess = true }) {
  if (notifiedTxs.has(hash)) return;
  notifiedTxs.add(hash);

  console.log(`[TEST] Simulated Tx: ${hash} -> ${amount} USDT`);

  let message = `💸 Payment ${isSuccess ? 'received' : 'failed'}:\n\n`;
  message += `💰 Amount: ${amount} USDT\n`;
  message += `🔗 Tx Hash: ${hash}\n`;

  if (!isSuccess) {
    message += `\n⚠️ Transaction failed. Please verify on-chain status.`;
  } else if (amount >= 29.9) {
    message += `\n🧠 You unlocked *Custom Oracle Reading*.\nPlease reply with your question.`;
    message += `\n\n🔮 Also receive a 3-card Tarot Reading:`;
  } else if (amount >= amountThreshold) {
    message += `\n🔮 Please focus your energy and draw 3 cards...`;
    message += `\n👇 Tap to reveal your Tarot Reading:`;
  } else {
    message += `\n⚠️ Below minimum threshold (${amountThreshold} USDT). Ignored.`;
  }

  if (testMode) {
    message = `🧪 [TEST MODE]\n\n` + message;
  }

  try {
    await sendMessage(userId, message);

    // 初始化抽牌会话 + 发送按钮
    if (amount >= amountThreshold) {
      startSession(userId);
      await sendTarotButtons(userId);
    }

    // 自动模拟按钮点击，仅前两个测试用
    if (
      hash === 'test_tx_001' ||
      hash === 'test_tx_002' ||
      hash === 'test_tx_004' ||
      hash === 'test_tx_005'
    ) {
      setTimeout(() => simulateButtonClick(userId, 'card_3'), 3000);
    }

    console.log(`[INFO] Message sent for ${hash}`);
  } catch (err) {
    console.error(`[ERROR] Simulate click failed: ${err.message}`);
  }
}

// ⏱️ 每次部署仅运行一次模拟交易
const testInterval = setInterval(() => {
  if (testCount < testTransactions.length) {
    handleTransaction(testTransactions[testCount]);
    testCount++;
  } else {
    clearInterval(testInterval);
    testMode = false;
    console.log('[INFO] Test mode complete. Now entering live mode.');
  }
}, 1500);
