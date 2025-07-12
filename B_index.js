// B_index.js — v1.2.12
// tarot-handler Webhook entry: delegates incoming Telegram updates, serves assets, provides test and upgrade endpoints

require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const { handleTelegramUpdate, markUserAsPremium } = require('./B_telegram');
const { simulateButtonClick } = require('./utils/G_simulate-click');
const { startSession } = require('./G_tarot-session');

const app = express();
app.use(bodyParser.json());

// Serve tarot images
app.use(
  '/tarot-images',
  express.static(path.join(__dirname, 'assets', 'tarot-cards'))
);

// Telegram Webhook
app.post('/webhook', async (req, res) => {
  try {
    console.log('📥 Received Webhook Payload:', JSON.stringify(req.body, null, 2));
    await handleTelegramUpdate(req.body);
    res.send('OK');
  } catch (err) {
    console.error('❌ Webhook handler error:', err);
    res.sendStatus(500);
  }
});

// Dev test endpoints
app.get('/test123', async (req, res) => {
  const devId = parseInt(process.env.RECEIVER_ID, 10);
  try {
    startSession(devId, 12);
    await simulateButtonClick(devId, 0, 12);
    await simulateButtonClick(devId, 1, 12);
    await simulateButtonClick(devId, 2, 12);
    res.send('✅ Test session triggered (card 1, 2, 3, amount 12).');
  } catch (err) {
    console.error('❌ Test123 error:', err);
    res.status(500).send('❌ Failed to trigger test123.');
  }
});

app.get('/test30', async (req, res) => {
  const devId = parseInt(process.env.RECEIVER_ID, 10);
  try {
    startSession(devId, 25);
    await simulateButtonClick(devId, 0, 25);
    await simulateButtonClick(devId, 1, 25);
    await simulateButtonClick(devId, 2, 25);
    res.send('✅ Test session triggered (card 1, 2, 3, amount 25).');
  } catch (err) {
    console.error('❌ Test30 error:', err);
    res.status(500).send('❌ Failed to trigger test30.');
  }
});

app.get('/simulate', async (req, res) => {
  const userId = parseInt(req.query.userId, 10);
  const cardIndex = parseInt(req.query.cardIndex, 10);
  const amount = parseFloat(req.query.amount);
  if (!userId || isNaN(cardIndex) || isNaN(amount)) {
    return res.status(400).send('❌ Missing parameters: userId, cardIndex, amount');
  }

  try {
    await simulateButtonClick(userId, cardIndex, amount);
    res.send(`✅ Simulated card ${cardIndex} click for user ${userId} with ${amount} USDT`);
  } catch (err) {
    console.error('❌ Simulation error:', err);
    res.status(500).send('❌ Simulation failed.');
  }
});

// ================= 新增：升级为高级版接口 =================
// POST /mark-premium  { chatId: 123456 }
app.post('/mark-premium', (req, res) => {
  const { chatId } = req.body;
  if (!chatId) return res.status(400).json({ error: "chatId required" });

  markUserAsPremium(Number(chatId));
  console.log(`🎉 [mark-premium] User ${chatId} marked as premium!`);
  res.json({ success: true });
});

// ================== 启动服务 ==================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
