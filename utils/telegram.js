// v1.0.13
const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const RECEIVER_ID = process.env.RECEIVER_ID;

async function sendTelegramMessage(text, options = {}) {
  try {
    const payload = {
      chat_id: RECEIVER_ID,
      text,
      parse_mode: "Markdown",
      ...options,
    };
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, payload);
  } catch (err) {
    console.error("[Telegram] Failed to send message:", err.message);
  }
}

async function sendCardButtons() {
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: RECEIVER_ID,
      text: "You have received a divine reading. Please choose your first card:",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🃏 Card 1", callback_data: "card_1" },
            { text: "🃏 Card 2", callback_data: "card_2" },
            { text: "🃏 Card 3", callback_data: "card_3" }
          ]
        ]
      }
    });
  } catch (err) {
    console.error("[Telegram] Failed to send card buttons:", err.message);
  }
}

async function handleTransaction({ amount, hash }) {
  console.log(`[Webhook] Received transaction: ${amount} USDT from ${hash}`);
  if (amount >= 30) {
    await sendTelegramMessage(`🌟 High-tier payment of ${amount} USDT received.\nYou will receive a custom divine session.`);
    await sendCardButtons();
  } else if (amount >= 12) {
    await sendTelegramMessage(`🔮 Basic tarot payment of ${amount} USDT received.`);
    await sendCardButtons();
  } else {
    await sendTelegramMessage(`⚠️ Received ${amount} USDT, which is below the minimum threshold.`);
  }
}

module.exports = {
  sendTelegramMessage,
  sendCardButtons,
  handleTransaction,
};
