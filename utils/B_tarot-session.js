// B_tarot-session.js - v1.1.0
const sessions = new Map();
const { getRandomCard } = require("./B_tarot-engine");

function startSession(userId, tier) {
  const deck = Array.from({ length: 78 }, (_, i) => i);
  const drawn = [];
  sessions.set(userId, { deck, drawn, tier });
  console.log(`🔮 Started new session for user ${userId} with tier ${tier}`);
}

function getCard(userId, index) {
  const session = sessions.get(userId);
  if (!session || session.drawn[index - 1]) return null;

  const deck = session.deck;
  const randomIndex = Math.floor(Math.random() * deck.length);
  const cardId = deck.splice(randomIndex, 1)[0];

  const card = { id: cardId };
  session.drawn[index - 1] = card;
  return card;
}

function isSessionComplete(userId) {
  const session = sessions.get(userId);
  return session && session.drawn.filter(Boolean).length === 3;
}

function endSession(userId) {
  sessions.delete(userId);
  console.log(`🧹 Session ended for user ${userId}`);
}

function getSessionTier(userId) {
  const session = sessions.get(userId);
  return session ? session.tier : null;
}

module.exports = {
  startSession,
  getCard,
  isSessionComplete,
  endSession,
  getSessionTier
};
