// routes/B_test-simulator.js - v1.2.0
// Updated to use dynamic pricing and simulateButtonClick
require("dotenv").config();
const express = require("express");
const router = express.Router();

const { startSession } = require("../G_tarot-session");
const { simulateButtonClick } = require("../G_simulate-click");

const DEV_ID = parseInt(process.env.RECEIVER_ID, 10);
const PRICE_BASIC = parseFloat(process.env.PRICE_BASIC);
const PRICE_PREMIUM = parseFloat(process.env.PRICE_PREMIUM);

/**
 * Webhook for testing sessions via Telegram commands
 */
router.post("/webhook", async (req, res) => {
  const update = req.body;

  try {
    // Handle text commands for developer
    if (update.message && update.message.text) {
      const text = update.message.text.trim();
      const chatId = update.message.chat.id;
      const userId = update.message.from.id;

      if (userId === DEV_ID && text === "/test123") {
        console.log("✅ /test123 triggered by developer");
        // Start Basic Plan session
        startSession(userId, PRICE_BASIC);
        // Simulate three card clicks
        for (let i = 0; i < 3; i++) {
          await simulateButtonClick(userId, i, PRICE_BASIC);
          console.log(`✅ Simulated card ${i + 1} click for BASIC plan`);
        }
        return res.sendStatus(200);
      }

      if (userId === DEV_ID && text === "/test30") {
        console.log("✅ /test30 triggered by developer");
        // Start Premium Plan session
        startSession(userId, PRICE_PREMIUM);
        // Simulate three card clicks
        for (let i = 0; i < 3; i++) {
          await simulateButtonClick(userId, i, PRICE_PREMIUM);
          console.log(`✅ Simulated card ${i + 1} click for PREMIUM plan`);
        }
        return res.sendStatus(200);
      }
    }

    // Fallback for button callback queries (if any)
    if (update.callback_query) {
      // simulateButtonClick already invoked above; no additional handling needed
      return res.sendStatus(200);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error in B_test-simulator webhook:", err);
    res.sendStatus(500);
  }
});

module.exports = router;
