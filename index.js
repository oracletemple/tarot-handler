// index.js - v1.2.1
// ✅ 修复模拟测试失败问题，允许开发者使用自定义 userId 进行调试
// ✅ 实际客户仍按正常流程走 session，不受影响

import express from "express";
import dotenv from "dotenv";
import { handleTransaction } from "./utils/transaction.js";
import { handleCallbackQuery } from "./utils/telegram.js";

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const WEBHOOK_PATH = "/webhook";

app.post(WEBHOOK_PATH, async (req, res) => {
  try {
    const body = req.body;

    // 处理按钮点击事件
    if (body.callback_query) {
      const callback = body.callback_query;
      await handleCallbackQuery(callback);
      return res.sendStatus(200);
    }

    // 处理链上交易事件
    const { amount, from, to, txid, type } = body;
    if (amount && from && to && txid && type === "transfer") {
      await handleTransaction({ amount, from, to, txid });
      return res.sendStatus(200);
    }

    console.warn("⚠️ Missing user_id or amount");
    return res.status(400).send("Invalid payload");
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
