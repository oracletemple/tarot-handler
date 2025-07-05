// v1.1.4
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const simulateUrl = `https://api.telegram.org/bot${BOT_TOKEN}/simulateClick`;

async function simulateClick(userId, cardNumber = 3) {
  try {
    const res = await axios.post(simulateUrl, {
      user_id: userId,
      data: `card_${cardNumber}`
    });

    if (res.data && res.data.ok) {
      console.log(`[SIMULATE] Clicked card_${cardNumber} for user ${userId}`);
    } else {
      throw new Error(res.data.description || 'Telegram API failed');
    }
  } catch (err) {
    throw new Error(`Simulate click failed: ${err.message}`);
  }
}

module.exports = { simulateClick };
