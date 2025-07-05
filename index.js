// v1.1.3 - 主入口文件（Webhook + 模拟交易支持）

const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { handleTransaction } = require("./utils/telegram");
dotenv.config();

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Tarot Webhook Service running.");
});

// ✅ Webhook 主入口
app.post("/webhook", async (req, res) => {
  const body = req.body;

  // 确认是交易通知（来自链监听器）
  if (body && body.hash && body.amount) {
    await handleTransaction(body);
    return res.status(200).send("Transaction handled");
  }

  // 确认是 Telegram 回调按钮点击
  if (body.callback_query) {
    await handleTransaction({ callback_query: body.callback_query });
    return res.status(200).send("Callback handled");
  }

  res.status(400).send("Invalid request");
});

// ✅ 支持 curl 模拟测试
app.post("/simulate-click", async (req, res) => {
  const { amount, hash } = req.body;
  if (!amount || !hash) return res.status(400).send("Missing params");

  const tx = {
    amount,
    hash,
    sender: "simulate_user_" + amount,
  };
  await handleTransaction(tx);
  res.send("Simulated transaction processed");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Tarot service running on port", PORT);
});
