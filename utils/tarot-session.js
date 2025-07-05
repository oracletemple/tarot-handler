// ✅ tarot-session.js (v1.0.11)

const sessions = new Map();

function startSession(userId) {
  sessions.set(userId, { cards: [] });
}

function getCard(userId, index) {
  const session = sessions.get(userId);
  if (!session || session.cards.length === 0) {
    // Generate 3 random cards
    session.cards = Array.from({ length: 3 }, () => Math.floor(Math.random() * 78) + 1);
    sessions.set(userId, session);
  }
  return session.cards[index - 1];
}

function isSessionComplete(userId) {
  const session = sessions.get(userId);
  return session && session.cards.length === 3;
}

module.exports = {
  startSession,
  getCard,
  isSessionComplete
};
