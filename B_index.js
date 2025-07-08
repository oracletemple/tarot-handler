// B_index.js - v1.2.6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const { handleTelegramUpdate } = require("./B_telegram");
const { simulateButtonClick } = require("./G_simulate-click");
const testSimulatorRouter = require("./routes/B_test-simulator"); // ✅ 新增

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

// ✅ 测试入口：开发者专属 /test123（模拟启动 12 USDT 占卜，全自动三张）
app.get("/test123", async (req, res) => {
  const devId = 7685088782;
  try {
    await simulateButtonClick(devId, 0, 12);
    await simulateButtonClick(devId, 1, 12);
    await simulateButtonClick(devId, 2, 12);
    res.send("✅ Test session triggered (card 1, 2, 3).");
  } catch (err) {
    res.status(500).send("❌ Failed to trigger test session.");
  }
});

// ✅ 测试入口：开发者专属 /test30（模拟启动 30 USDT 占卜，全自动三张）
app.get("/test30", async (req, res) => {
  const devId = 7685088782;
  try {
    await simulateButtonClick(devId, 0, 30);
    await simulateButtonClick(devId, 1, 30);
    await simulateButtonClick(devId, 2, 30);
    res.send("✅ Test session triggered (card 1, 2, 3, amount 30).");
  } catch (err) {
    res.status(500).send("❌ Failed to trigger test30.");
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

// ✅ 注册 POST 测试模拟入口
app.use("/", testSimulatorRouter); // ✅ 新增 POST 接口挂载

// 🚀 启动服务
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
