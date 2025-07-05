// v1.1.4
require('dotenv').config();
const axios = require('axios');
const { startSession, getCard } = require('./tarot-session');

const WALLET = process.env.WALLET_ADDRESS;
const RECEIVER_ID = parseInt(process.env.RECEIVER_ID);
const AMOUNT_THRESHOLD = parseFloat(process.env.AMOUNT_THRESHOLD || '10');

function isTargetTransaction(tx) {
  return (
    tx.to === WALLET &&
    parseFloat(tx.amount) >= AMOUNT_THRESHOLD &&
    tx.tokenSymbol === 'USDT'
  );
}

function getTarotTier(tx) {
  const amount = parseFloat(tx.amount);
  if (amount >= 30) return 'premium';
  if (amount >= 12) return 'basic';
  return 'none';
}

async function simulateClick(userId, cardIndex) {
  try {
    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/callback_query`, {
      callback_query: {
        id: 'simulate_' + Date.now(),
        from: { id: userId },
        data: `card_${cardIndex}`,
      }
    });
  } catch (err) {
    console.error('[ERROR] Simulate click failed:', err.message);
  }
}

async function processTransaction(tx) {
  if (!isTargetTransaction(tx)) return;

  const tier = getTarotTier(tx);
  const userId = RECEIVER_ID;
  const txid = tx.hash || tx.txid || 'unknown_tx';

  console.log(`[TEST] Simulated Tx: ${txid} -> ${tx.amount} USDT`);
  await sendTelegramMessage(userId, tier, txid);

  // 自动模拟点击流程（仅限前两单）
  const idSuffix = txid.split('_').pop();
  if (['001', '002'].includes(idSuffix)) {
    await startSession(userId);
    await simulateClick(userId, 0);
    await simulateClick(userId, 1);
  }
}

async function sendTelegramMessage(userId, tier, txid) {
  const buttons = [
    { text: 'Draw First Card', callback_data: 'card_0' },
    { text: 'Draw Second Card', callback_data: 'card_1' },
    { text: 'Draw Final Card', callback_data: 'card_2' }
  ];

  let text = `🔮 Transaction ID: ${txid}\nYour reading session has begun.`;
  if (tier === 'premium') {
    text += `\n\n🌟 Premium reading will follow with deep insights.`;
  }

  try {
    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      chat_id: userId,
      text,
      reply_markup: { inline_keyboard: [buttons] }
    });
    console.log(`[INFO] Message sent for ${txid}`);
  } catch (err) {
    console.error('[ERROR] sendTelegramMessage failed:', err.message);
  }
}

module.exports = { processTransaction };
