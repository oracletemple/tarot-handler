// B_transaction.js - v1.1.1

const { startSession } = require("./B_tarot-session");
const { sendCardButtons } = require("./B_send-message");

const RECEIVER_ID = parseInt(process.env.RECEIVER_ID); // your Telegram user ID
const AMOUNT_THRESHOLD = parseFloat(process.env.AMOUNT_THRESHOLD);

/**
 * Detect valid USDT payment messages and trigger session + buttons
 * @param {object} message - Telegram message object
 */
async function handleTransactionMessage(message) {
  if (!message || !message.from || !message.text) return;

  const chatId = message.chat.id;
  const userId = message.from.id;
  const text = message.text.trim();

  const regex = /You sent (\d+(?:\.\d+)?) USDT/i;
  const match = text.match(regex);

  if (!match) return;

  const amount = parseFloat(match[1]);
  if (isNaN(amount)) return;

  if (amount < AMOUNT_THRESHOLD) {
    await sendCardButtons(chatId, "⚠️ Received " + amount + " USDT, which is below the minimum threshold.");
    return;
  }

  // Create session
  await startSession(userId, amount);
  await sendCardButtons(chatId, "🔮 Your spiritual reading is ready. Please choose a card to reveal:");
}

module.exports = { handleTransactionMessage };
