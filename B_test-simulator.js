// test-simulator.js - v1.0.2

const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.RECEIVER_ID; // 7685088782
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

const premiumKeys = [
  "pastlife", "purpose", "karma",
  "energy", "timing", "symbol",
  "spirit", "mirror", "journal"
];

async function simulateButtonClick(callback_data) {
  try {
    const res = await axios.post(`${API_URL}/webhook`, {
      callback_query: {
        id: String(Date.now()),
        from: { id: CHAT_ID, is_bot: false, first_name: "Dev" },
        message: {
          message_id: Math.floor(Math.random() * 10000),
          chat: { id: CHAT_ID, type: "private" },
          text: "Button test"
        },
        data: `premium_${callback_data}`
      }
    });
    console.log(`✅ Clicked: ${callback_data}`, res.data);
  } catch (err) {
    console.error(`❌ Error clicking ${callback_data}`, err.response?.data || err.message);
  }
}

(async () => {
  for (const key of premiumKeys) {
    await simulateButtonClick(key);
    await new Promise(res => setTimeout(res, 1500)); // 每次间隔 1.5 秒
  }
})();
