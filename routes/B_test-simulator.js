// routes/B_test-simulator.js - v1.2.2
// Simulate basic/premium plan via webhook for dev, now includes test27 for premium unlock
require("dotenv").config();
const express = require("express");
const router = express.Router();

const { startSession } = require("../G_tarot-session");
const { simulateButtonClick } = require("../utils/G_simulate-click");
const { markUserAsPremium } = require("../B_telegram"); // 新增自动解锁

const DEV_ID = parseInt(process.env.RECEIVER_ID, 10);
const PRICE_BASIC = parseFloat(process.env.PRICE_BASIC || "12");
const PRICE_PREMIUM = parseFloat(process.env.PRICE_PREMIUM || "24");

/**
 * Webhook for testing sessions via Telegram commands
 */
router.post("/webhook", async (req, res) => {
  const update = req.body;

  try {
    if (update.message && update.message.text) {
      const text = update.message.text.trim();
      const chatId = update.message.chat.id;
      const userId = update.message.from.id;

      // /test123 = Basic
      if (userId === DEV_ID && text === "/test123") {
        startSession(userId, PRICE_BASIC);
        for (let i = 0; i < 3; i++) {
          await simulateButtonClick(userId, i, PRICE_BASIC);
        }
        return res.sendStatus(200);
      }
      // /test30 = Premium
      if (userId === DEV_ID && text === "/test30") {
        markUserAsPremium(userId); // 自动解锁
        startSession(userId, PRICE_PREMIUM);
        for (let i = 0; i < 3; i++) {
          await simulateButtonClick(userId, i, PRICE_PREMIUM);
        }
        return res.sendStatus(200);
      }
      // /test27 = 补差价/升级（直接解锁 premium）
      if (userId === DEV_ID && text === "/test27") {
        markUserAsPremium(userId);
        // 也可以模拟 session/init
        startSession(userId, PRICE_PREMIUM);
        return res.sendStatus(200);
      }
    }

    // 支持 callback_query 测试（可选，实际不会模拟点击按钮）
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error in B_test-simulator webhook:", err);
    res.sendStatus(500);
  }
});

module.exports = router;
