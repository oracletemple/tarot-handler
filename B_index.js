// B_index.js // v1.2.2

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { handleTelegramUpdate } = require("./utils/B_telegram");
const { simulateButtonClick } = require("./utils/B_simulate-click");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const TEST_USER_ID = 7685088782;

// ✅ Webhook 接收入口
app.post("/webhook", async (req, res) => {
  try {
    const update = req.body;
    console.log("📥 Received Webhook Payload:", JSON.stringify(update, null, 2));

    await handleTelegramUpdate(update);
    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Webhook handler error:", error.message);
    res.sendStatus(500);
  }
});

// ✅ 测试入口：仅限本人使用
app.get("/test123", async (req, res) => {
  try {
    const userId = TEST_USER_ID;
    await simulateButtonClick(userId, 1, 12);
    await simulateButtonClick(userId, 2, 12);
    res.status(200).send("✅ Test card 1 & 2 simulated.");
  } catch (error) {
    console.error("❌ Test endpoint failed:", error.message);
    res.sendStatus(500);
  }
});

// ✅ HTTP 调用模拟测试（开发者外部模拟按钮点击）
// 用于发送 POST 请求模拟交易
app.post("/simulate-test", async (req, res) => {
  const { userId, cardIndex, amount } = req.body;

  if (!userId || !cardIndex || !amount) {
    return res.status(400).send("❌ Missing parameters");
  }

  try {
    await simulateButtonClick(userId, cardIndex, amount);
    res.status(200).send(`✅ Simulated card ${cardIndex} click for user ${userId}`);
  } catch (error) {
    console.error("❌ Simulate API error:", error.message);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
