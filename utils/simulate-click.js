// v1.1.0 - utils/simulate-click.js

const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function simulateClick(userId, label) {
  try {
    await axios.post(`${API_URL}/sendMessage`, {
      chat_id: userId,
      text: label
    });
  } catch (error) {
    console.error("Simulate click failed:", error.response?.data || error.message);
  }
}

module.exports = { simulateClick };
