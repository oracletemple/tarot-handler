// B_tarot.js - v1.1.1

const { getCard } = require("./B_tarot-session");
const { generateCardMessage } = require("./B_tarot-engine");
const { sendMessage } = require("./B_send-message");

/**
 * 处理塔罗按钮点击事件
 * @param {number} userId - 用户 Telegram ID
 * @param {string} data - callback_data，如 "card_1_12"
 */
async function handleCardButton(userId, data) {
  const match = data.match(/^card_(\d)_(\d+)$/);
  if (!match) {
    return await sendMessage(userId, "❌ Invalid card format.");
  }

  const cardIndex = parseInt(match[1]);
  const amount = parseInt(match[2]);

  try {
    const card = await getCard(userId, cardIndex);
    if (!card) {
      return await sendMessage(userId, "⚠️ Session not found. Please try again later.");
    }

    const message = generateCardMessage(card, cardIndex);
    await sendMessage(userId, message);
  } catch (err) {
    console.error("❌ Error in handleCardButton:", err);
    await sendMessage(userId, "❌ Something went wrong. Please try again.");
  }
}

module.exports = {
  handleCardButton
};
