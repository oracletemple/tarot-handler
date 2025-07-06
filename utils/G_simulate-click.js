// G_simulate-click.js - v1.1.3

const axios = require("axios");

const WEBHOOK_URL = process.env.WEBHOOK_URL;

/**
 * 模拟按钮点击，向 Webhook 推送 callback_query 数据
 * @param {number} userId - Telegram 用户 ID
 * @param {number} cardIndex - 1 / 2 / 3
 * @param {number} amount - 12 / 30
 */
async function simulateButtonClick(userId, cardIndex, amount) {
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
    await axios.post(WEBHOOK_URL, payload, {
      headers: { "Content-Type": "application/json" }
    });
    console.log(`✅ Simulated card ${cardIndex} click for user ${userId} (${amount} USDT)`);
  } catch (err) {
    console.error("❌ simulateButtonClick failed:", err.response?.data || err.message);
  }
}

module.exports = { simulateButtonClick };
