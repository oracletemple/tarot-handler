// index.js
// v1.1.2 模拟修复版 · 支持公网 URL 请求和正确的 chatId

import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const BOT_TOKEN = '7842470393:AAG6T07t_fzzZIOBrccWKF-A_gGPweVGVZc';
const WALLET_ADDRESS = 'TYQQ3QigecskEi4B41BKDoTsmZf9BaFTbU';
const RECEIVER_ID = '7685088782';
const AMOUNT_THRESHOLD = 10;
const HANDLER_URL = 'https://tarot-handler.onrender.com/webhook'; // ✅ 使用公网 URL

app.post('/webhook', async (req, res) => {
  // 你可以在这里添加真实链上监听逻辑
  res.sendStatus(200);
});

// ✅ 启动后自动模拟两笔交易
async function simulatePayment() {
  const payment1 = {
    amount: 12,
    txid: 'SIMULATED_TX_001',
    userId: RECEIVER_ID,
  };

  const payment2 = {
    amount: 30,
    txid: 'SIMULATED_TX_002',
    userId: RECEIVER_ID,
  };

  try {
    // 第一个模拟（12 USDT）
    await fetch(HANDLER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment1),
    });

    // 模拟点击三张牌
    await delay(3000);
    await clickCard(RECEIVER_ID, 1);
    await delay(2000);
    await clickCard(RECEIVER_ID, 2);
    await delay(2000);
    await clickCard(RECEIVER_ID, 3);

    // 第二个模拟（30 USDT）
    await delay(3000);
    await fetch(HANDLER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payment2),
    });

    // 只模拟前两张牌点击
    await delay(3000);
    await clickCard(RECEIVER_ID, 1);
    await delay(2000);
    await clickCard(RECEIVER_ID, 2);

  } catch (error) {
    console.error('❌ 模拟交易失败:', error);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function clickCard(userId, cardIndex) {
  try {
    await fetch(HANDLER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query: {
          from: { id: userId },
          data: `card_${cardIndex}`,
        },
      }),
    });
    console.log(`✅ 模拟点击 Card ${cardIndex} 成功`);
  } catch (err) {
    console.error(`❌ 模拟点击 Card ${cardIndex} 失败`, err);
  }
}

app.listen(10000, async () => {
  console.log('USDT listener running on port 10000');
  await delay(3000); // 等服务稳定后模拟
  await simulatePayment(); // 🚀 启动模拟测试
});
