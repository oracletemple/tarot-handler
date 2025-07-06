// B_tarot.js - v1.1.1

const { getCard, isSessionComplete, endSession } = require("./B_tarot-session");
const { sendMessage, sendImage, removeCardButtons } = require("./B_send-message");

/**
 * Handle callback_query interaction (card_1_12 etc)
 * @param {object} callbackQuery
 */
async function handleTarotInteraction(callbackQuery) {
  const { id: queryId, from, message, data } = callbackQuery;
  const userId = from.id;
  const messageId = message.message_id;
  const chatId = message.chat.id;

  if (!data.startsWith("card_")) return;

  const match = data.match(/^card_(\d)_(\d+)/);
  if (!match) {
    await sendMessage(chatId, "❌ Invalid card selection.");
    return;
  }

  const cardIndex = parseInt(match[1]);
  const amount = parseInt(match[2]);

  try {
    const card = await getCard(userId, cardIndex);
    if (!card) {
      await sendMessage(chatId, "⚠️ Session not found or card already drawn.");
      return;
    }

    const label = ["Past", "Present", "Future"][cardIndex - 1] || `Card ${cardIndex}`;
    const caption = `*${label}:* ${card.name}\n_${card.meaning}_`;

    await sendImage(chatId, card.image, caption);

    if (isSessionComplete(userId)) {
      await removeCardButtons(chatId, messageId);
      await endSession(userId);

      if (amount === 30) {
        await sendMessage(chatId, "🌟 Thank you for choosing the premium reading. Your deep spiritual guidance will be sent shortly...");
        // TODO: Add custom GPT reading hook here
      }
    }
  } catch (err) {
    console.error("❌ Tarot interaction error:", err.message);
    await sendMessage(chatId, "An error occurred while processing your card.");
  }
}

module.exports = { handleTarotInteraction };
