// B_index.js — v1.2.11
// tarot-handler Webhook entry: delegates incoming Telegram updates, serves assets, and provides test endpoints
require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const { handleTelegramUpdate } = require("./B_telegram");
const { simulateButtonClick } = require("./G_simulate-click");
const { startSession } = require("./G_tarot-session");

const app = express();
app.use(bodyParser.json());

// ⚠️ 本次新增：暴露 tarot-cards 静态资源
app.use(
  "/tarot-images",
  express.static(path.join(__dirname, "assets", "tarot-cards"))
);

// ✅ Webhook 主入口（修复超时）
app.post("/webhook", async (req, res) => {
  try {
    console.log("📥 Received Webhook Payload:", JSON.stringify(req.body, null, 2));
    await handleTelegramUpdate(req.body); // 只传 req.body，不传 req/res
    res.send("OK"); // 添加响应，避免 Telegram 超时重试
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    res.sendStatus(500);
  }
});

// ✅ 测试入口：开发者专属 /test123（模拟启动 12 USDT 占卜，全自动三张）
app.get("/test123", async (req, res) => {
  const devId = parseInt(process.env.RECEIVER_ID, 10);
  try {
    startSession(devId, 12);
    await simulateButtonClick(devId, 0, 12);
    await simulateButtonClick(devId, 1, 12);
    await simulateButtonClick(devId, 2, 12);
    res.send("✅ Test session triggered (card 1, 2, 3).");
  } catch (err) {
    console.error("❌ Test123 error:", err);
    res.status(500).send("❌ Failed to trigger test123.");
  }
});

// ✅ 测试入口：开发者专属 /test30（模拟启动 30 USDT 占卜，全自动三张）
app.get("/test30", async (req, res) => {
  const devId = parseInt(process.env.RECEIVER_ID, 10);
  try {
    startSession(devId, 30);
    await simulateButtonClick(devId, 0, 30);
    await simulateButtonClick(devId, 1, 30);
    await simulateButtonClick(devId, 2, 30);
    res.send("✅ Test session triggered (card 1, 2, 3, amount 30).");
  } catch (err) {
    console.error("❌ Test30 error:", err);
    res.status(500).send("❌ Failed to trigger test30.");
  }
});

// ✅ 测试入口：任意模拟点击接口（GET 请求）
app.get("/simulate", async (req, res) => {
  const userId = parseInt(req.query.userId, 10);
  const cardIndex = parseInt(req.query.cardIndex, 10);
  const amount = parseFloat(req.query.amount);
  if (!userId || isNaN(cardIndex) || isNaN(amount)) {
    return res.status(400).send("❌ Missing parameters: userId, cardIndex, amount");
  }

  try {
    await simulateButtonClick(userId, cardIndex, amount);
    res.send(`✅ Simulated card ${cardIndex} click for user ${userId} with ${amount} USDT`);
  } catch (err) {
    console.error("❌ Simulation error:", err);
    res.status(500).send("❌ Simulation failed.");
  }
});

// 🚀 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
