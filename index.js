// index.js - v1.2.0

import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { sendButtonsMessage, sendCardResult } from "./utils/telegram.js";
import { startSession } from "./utils/tarot-session.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;

app.post("/webhook", async (req, res) => {
  console.log("📥 Received Webhook Payload:", req.body); // 🐞调试输出

  const { user_id, amount } = req.body;

  // 🛡 严格类型判断防止 false/undefined 等误判
  if (typeof user_id !== "number" || typeof amount !== "number") {
    return res.status(400).send("⚠️ user_id or amount must be number");
  }

  try {
    startSession(user_id, amount);
    console.log(`🌀 Session started for user ${user_id} with ${amount} USDT`);

    if (amount >= 10 && amount < 20) {
      await sendButtonsMessage(user_id);
    } else if (amount >= 20) {
      await sendButtonsMessage(user_id);
      await sendCardResult(user_id, "✨ GPT Spiritual Insight", "You will receive a personalized spiritual reading shortly.");
    }

    res.send("✅ Webhook processed");
  } catch (err) {
    console.error("❌ Webhook Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/", (_, res) => {
  res.send("🧙 Tarot Handler Webhook is running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
