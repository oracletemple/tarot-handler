// B_tarot-session.js - v1.1.1

const fs = require("fs");
const path = require("path");
const tarotCards = require("./B_card-data");

const sessions = new Map();

/**
 * Start a tarot session for user.
 * @param {number} userId - Telegram user ID
 * @param {number} amount - Payment amount
 */
function startSession(userId, amount) {
  const deck = [...tarotCards];
  const selected = [];

  while (selected.length < 3) {
    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck.splice(randomIndex, 1)[0];
    selected.push(card);
  }

  sessions.set(userId, {
    amount,
    drawn: [],
    cards: selected
  });
}

/**
 * Get a card by index for the user (1-based index).
 * @param {number} userId - Telegram user ID
 * @param {number} index - Card index: 1, 2, or 3
 * @param {number} amount - Payment amount (12 or 30)
 * @returns {object|null} - Card object or null
 */
function getCard(userId, index, amount) {
  const session = sessions.get(userId);
  if (!session || session.amount !== amount) return null;
  if (session.drawn.includes(index)) return null;

  session.drawn.push(index);
  return session.cards[index - 1] || null;
}

/**
 * Check if user has drawn all 3 cards.
 * @param {number} userId
 * @returns {boolean}
 */
function isSessionComplete(userId) {
  const session = sessions.get(userId);
  return session?.drawn?.length >= 3;
}

module.exports = {
  startSession,
  getCard,
  isSessionComplete
};
