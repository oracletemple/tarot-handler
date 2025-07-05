// v1.1.2
require('dotenv').config();
const { sendMessage, sendTarotButtons, simulateButtonClick } = require('./utils/telegram');
const { startSession } = require('./utils/tarot-session');

const userId = process.env.RECEIVER_ID;
let testMode = true;
let testCount = 0;

const testTransactions = [
  { amount: 12, hash: 'test_tx_001' },
  { amount: 12, hash: 'test_tx_002' },
  { amount: 12, hash: 'test_tx_003' },
  { amount: 30, hash: 'test_tx_004' },
  { amount: 30, hash: 'test_tx_005' },
  { amount: 30, hash: 'test_tx_006' }
];

async function handleTransaction({ amount, hash }) {
  if (!userId) return;

  let message = `💸 Payment received:\n\n💰 Amount: ${amount} USDT\n🔗 Tx Hash: ${hash}\n`;

  if (amount >= 29.9) {
    message += `\n🧠 You unlocked *Custom Oracle Reading*.\nPlease reply with your question.\n\n🔮 Also receive a 3-card Tarot Reading:`;
  } else {
    message += `\n🔮 Please focus your energy and draw 3 cards...\n👇 Tap below to begin:`;
  }

  try {
    await sendMessage(userId, message);
    startSession(userId);
    await sendTarotButtons(userId);

    if (hash === 'test_tx_001' || hash === 'test_tx_002') {
      setTimeout(() => simulateButtonClick(userId, 'card_3'), 2000);
    }
    if (hash === 'test_tx_004' || hash === 'test_tx_005') {
      setTimeout(() => simulateButtonClick(userId, 'card_3'), 2000);
    }

    console.log(`[INFO] Message sent for ${hash}`);
  } catch (err) {
    console.error(`[ERROR] ${hash}:`, err.message);
  }
}

const interval = setInterval(() => {
  if (testCount < testTransactions.length) {
    handleTransaction(testTransactions[testCount]);
    testCount++;
  } else {
    clearInterval(interval);
    testMode = false;
    console.log('[INFO] Test mode complete. Now entering live mode.');
  }
}, 1500);

console.log('🚀 Tarot Webhook Server running at http://localhost:3000');
