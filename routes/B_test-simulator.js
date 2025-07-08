// routes/B_test-simulator.js - v1.0.1

const express = require("express");
const axios = require("axios");
const router = express.Router();

/**
 * 测试入口：POST /simulate-test-click
 * Body 参数：{ userId, cardIndex, amount }
 */
router.post("/simulate-test-click", async (req, res) => {
  const { userId, cardIndex, amount } = req.body;

  const payload = {
    update_id: Math.floor(Math.random() * 10000000),
    callback_query: {
      id: "fake-callback-id",
      from: {
        id: userId,
        is_bot: false,
        first_name: "TestUser",
        username: "testuser"
      },
      message: {
        message_id: 222,
        date: Math.floor(Date.now() / 1000),
        chat: {
          id: userId,
          type: "private"
        },
        text: "Your spiritual reading is ready. Please choose a card to reveal:"
      },
      chat_instance: "test_instance",
      data: `card_${cardIndex}_${amount}`
    }
  };

  try {
    await axios.post(process.env.WEBHOOK_URL, payload, {
      headers: { "Content-Type": "application/json" }
    });
    res.send("✅ Test click simulated.");
  } catch (error) {
    res.status(500).send("❌ Error simulating click: " + (error.response?.data || error.message));
  }
});

module.exports = router;
