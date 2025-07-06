// index.js - v1.2.1
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { sendButtonsMessage, sendCardResult } from "./utils/telegram.js";
import { extractTransactionInfo } from "./utils/transaction.js";
import { startSession, getCard, isSessionComplete } from "./utils/tarot-session.js";
import cardData from "./data/card-data.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const RECEIVER_ID = process.env.RECEIVER_ID;
const AMOUNT_THRESHOLD = parseFloat(process.env.AMOUNT_THRESHOLD || "10");

app.post("/webhook", async (req, res) => {
  const { user_id, amount } = extractTransactionInfo(req.body);

  if (!user_id || !amount) {
    console.warn("⚠️ Missing user_id or amount");
    return res.sendStatus(400);
  }

  if (amount < AMOUNT_THRESHOLD) {
    console.warn(`⚠️ Received ${amount} USDT, which is below the minimum threshold.`);
    return res.sendStatus(200);
  }

  // ✅ 启动 session
  startSession(user_id, amount);

  // ✅ 发送按钮消息
  await sendButtonsMessage(user_id, amount);
  res.sendStatus(200);
});

app.post("/click", async (req, res) => {
  const { user_id, card_index } = req.body;
  if (!user_id || typeof card_index !== "number") return res.sendStatus(400);

  const cardId = getCard(user_id, card_index);
  if (cardId == null || !cardData[cardId]) return res.sendStatus(400);

  const card = cardData[cardId];
  await sendCardResult(user_id, card_index, card);

  if (isSessionComplete(user_id)) {
    console.log(`✅ Session complete for user ${user_id}`);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
