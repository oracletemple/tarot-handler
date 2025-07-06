// send-message.js - v1.0.0

import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

/**
 * Sends a text message via Telegram bot.
 * @param {number} chat_id - Telegram user ID.
 * @param {string} text - Message content.
 * @param {object} [options={}] - Optional parameters (e.g. reply_markup).
 */
export default async function sendMessage(chat_id, text, options = {}) {
  if (!BOT_TOKEN) {
    console.error("❌ BOT_TOKEN is missing in .env");
    return;
  }

  const payload = {
    chat_id,
    text,
    parse_mode: "Markdown",
    ...options,
  };

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error("❌ Failed to send message:", data.description);
    } else {
      console.log("✅ Message sent to", chat_id);
    }
  } catch (error) {
    console.error("❌ Error sending message:", error);
  }
}
