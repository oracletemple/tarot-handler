// B_tarot.js // v1.1.0

const { getCard } = require("./B_tarot-session");
const { sendCardMessage } = require("./B_telegram");

/**
 * Handle Tarot card reveal when user clicks a button (card_1_12, card_2_12, etc.)
 * 
 * @param {number} userId - Telegram user ID
 * @param {number} index - Card index (1/2/3)
 * @param {number} amount - Payment amount (12 or 30)
 */
async function handleCardReveal(userId, index, amount) {
  try {
    const card = await getCard(userId, index);
    if (!card) {
      await sendCardMessage(userId, "⚠️ Session not found or already completed. Please try again.");
      return;
    }

    let label = "";
    switch (index) {
      case 1: label = "🌅 Past"; break;
      case 2: label = "🌟 Present"; break;
      case 3: label = "🌄 Future"; break;
      default: label = "🔮 Unknown";
    }

    const message = `✨ <b>${label}</b>\n<b>${card.name}</b>\n\n<i>${card.meaning}</i>`;

    await sendCardMessage(userId, message, card.image);
  } catch (error) {
    console.error("Error in handleCardReveal:", error);
  }
}

module.exports = { handleCardReveal };
