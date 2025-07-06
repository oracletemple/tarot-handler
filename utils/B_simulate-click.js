// B_simulate-click.js // v1.1.0

const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * Simulate a button click by triggering a callback_query update to the Webhook.
 * This is mainly used for automated testing after payment detection.
 * 
 * @param {number} userId - Telegram user ID to simulate interaction for.
 * @param {number} cardIndex - Card index (1/2/3).
 * @param {number} amount - Payment amount (12 or 30).
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
    await axios.post(process.env.WEBHOOK_URL, payload, {
      headers: { "Content-Type": "application/json" }
    });
    console.log(`✅ Simulated card ${cardIndex} click for user ${userId}`);
  } catch (err) {
    console.error("❌ Failed to simulate button click:", err.response?.data || err.message);
  }
}

module.exports = { simulateButtonClick };
