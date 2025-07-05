// v1.1.0 - utils/simulate-click.js (auto-filled with BOT_TOKEN)

const axios = require("axios");

// ✅ 自动注入 BOT_TOKEN，无需 .env 配置
const BOT_TOKEN = "7842470393:AAG6T07t_fzzZIOBrccWKF-A_gGPweVGVZc";
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
