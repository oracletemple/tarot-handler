// send-message.js - v1.1.0

import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * ✅ 发送基础文字消息
 */
export async function sendMessage(chat_id, text, options = {}) {
  if (!BOT_TOKEN) return console.error("❌ BOT_TOKEN missing");

  const payload = {
    chat_id,
    text,
    parse_mode: "Markdown",
    ...options,
  };

  try {
    const res = await fetch(`${API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.ok) console.error("❌ Message error:", data.description);
    else console.log("✅ Message sent to", chat_id);
  } catch (err) {
    console.error("❌ Failed to send message:", err);
  }
}

/**
 * ✅ 发送抽牌按钮（1 / 2 / 3）
 */
export async function sendCardButtons(chat_id) {
  const buttons = {
    inline_keyboard: [
      [
        { text: "🃏 Card 1", callback_data: "card_1" },
        { text: "🃏 Card 2", callback_data: "card_2" },
        { text: "🃏 Card 3", callback_data: "card_3" },
      ],
    ],
  };

  await sendMessage(chat_id, "✨ Please choose your card:", {
    reply_markup: buttons,
  });
}

/**
 * ✅ 发送塔罗牌抽取结果
 */
export async function sendCardResult(chat_id, card, positionLabel = "Your card") {
  const message = `🔮 *${positionLabel}*\n\n*${card.name}*\n_${card.meaning}_`;
  await sendMessage(chat_id, message);
}

/**
 * ✅ 更新原消息，清除已点击按钮
 */
export async function updateMessageButtons(chat_id, message_id, clickedIndex) {
  const newButtons = {
    inline_keyboard: [
      [0, 1, 2].map((i) => ({
        text: `🃏 Card ${i + 1}`,
        callback_data: i === clickedIndex ? "disabled" : `card_${i + 1}`,
      })),
    ],
  };

  // 替换点击按钮为 disabled
  newButtons.inline_keyboard[0][clickedIndex].text = "✅ Chosen";
  newButtons.inline_keyboard[0][clickedIndex].callback_data = "chosen";

  try {
    const res = await fetch(`${API_URL}/editMessageReplyMarkup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id,
        message_id,
        reply_markup: newButtons,
      }),
    });

    const data = await res.json();
    if (!data.ok) console.error("❌ Failed to update buttons:", data.description);
    else console.log(`🔁 Buttons updated for card ${clickedIndex + 1}`);
  } catch (err) {
    console.error("❌ Error updating buttons:", err);
  }
}
