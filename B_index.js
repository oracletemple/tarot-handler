// B_index.js - v1.2.4

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const { handleTelegramUpdate } = require("./B_telegram");
const { simulateButtonClick } = require("./G_simulate-click");

const app = express();
app.use(bodyParser.json());

// ✅ Webhook 主入口
app.post("/webhook", async (req, res) => {
  try {
    const update = req.body;
    console.log("📥 Received Webhook Payload:", JSON.stringify(update, null, 2));
    await handleTelegramUpdate(update);
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    res.sendStatus(500);
  }
});

// ✅ 测试入口：开发者专属 /test123（模拟启动 12 USDT 占卜）
app.get("/test123", async (req, res) => {
  const devId = 7685088782; // 仅允许此 ID 调用测试功能
  try {
    await simulateButtonClick(devId, 1, 12);
    await simulateButtonClick(devId, 2, 12);
    res.send("✅ Test session triggered (card 1 & 2).");
  } catch (err) {
    res.status(500).send("❌ Failed to trigger test session.");
  }
});

// ✅ 测试入口：任意模拟点击接口（GET 请求）
app.get("/simulate", async (req, res) => {
  const { userId, cardIndex, amount } = req.query;
  if (!userId || !cardIndex || !amount) {
    return res.status(400).send("❌ Missing parameters: userId, cardIndex, amount");
  }

  try {
    await simulateButtonClick(Number(userId), Number(cardIndex), Number(amount));
    res.send(`✅ Simulated card ${cardIndex} click for user ${userId} with ${amount} USDT`);
  } catch (err) {
    res.status(500).send("❌ Simulation failed.");
  }
});

// 🚀 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
