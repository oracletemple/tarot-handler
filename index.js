// usdt-listener/index.js - v1.0.8

require('dotenv').config();
const axios = require('axios');
const { sendMessage, sendTarotButtons, simulateButtonClick } = require('./utils/telegram');
const { startSession } = require('./utils/tarot-session');

const wallet = process.env.WALLET_ADDRESS;
const userId = process.env.RECEIVER_ID;
const amountThreshold = parseFloat(process.env.AMOUNT_THRESHOLD || '12');

const notifiedTxs = new Set();
let testCount = 0;
let testMode = true;

// Simulated test transactions (3x12USDT + 3x30USDT)
const testTransactions = [
  { amount: 12, hash: 'test_tx_001' }, // 模拟抽一张
  { amount: 12, hash: 'test_tx_002' }, // 模拟抽一张
  { amount: 12, hash: 'test_tx_003' }, // 留空做人工实测
  { amount: 30, hash: 'test_tx_004' }, // 模拟抽一张 + GPT 解读
  { amount: 30, hash: 'test_tx_005' }, // 模拟抽一张 + GPT 解读
  { amount: 30, hash: 'test_tx_006' }, // 留空做人工实测
];

async function handleTransaction({ amount, hash, isSuccess = true }) {
  if (notifiedTxs.has(hash)) return;
  notifiedTxs.add(hash);

  console.log(`[TEST] Simulated Tx: ${hash} -> ${amount} USDT`);

  let message = `💸 Payment ${isSuccess ? 'received' : 'failed'}:\n\n`;
  message += `💰 Amount: ${amount} USDT (TRC20)\n`;
  message += `🔗 Tx Hash: ${hash}\n`;

  if (!isSuccess) {
    message += `\n⚠️ Transaction failed. Please verify on-chain status.`;
  } else if (amount >= 29.9) {
    message += `\n🔮 You have unlocked the *Custom Oracle Reading* (30 USDT Tier).\nPlease reply with your question – we will begin your spiritual decoding.`;
  } else if (amount >= amountThreshold && amount < 29.9) {
    message += `\n🎴 Please focus your energy and draw 3 cards...\n👇 Tap the buttons to reveal your Tarot Reading:`;
  } else {
    message += `\n⚠️ Payment below minimum threshold (${amountThreshold} USDT). It will not be processed.`;
  }

  if (testMode) {
    message = `🧪 [TEST MODE]\n\n` + message;
  }

  try {
    await sendMessage(userId, message);

    if (amount >= amountThreshold && isSuccess) {
      startSession(userId); // 初始化 session
      await sendTarotButtons(userId);
    }

    // 自动模拟按钮点击（模拟 1 张牌）
    const shouldSimulate = [
      'test_tx_001',
      'test_tx_002',
      'test_tx_004',
      'test_tx_005'
    ];

    if (shouldSimulate.includes(hash)) {
      setTimeout(() => simulateButtonClick(userId, 'draw_3'), 1500);
    }

    console.log(`[INFO] Message sent to Telegram ✅`);
  } catch (err) {
    console.error(`[ERROR] Failed to send message: ${err.message}`);
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
}, 1200);
