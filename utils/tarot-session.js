// v1.1.0 - utils/tarot-session.js

const sessions = {};

function startSession(userId) {
  if (!sessions[userId]) {
    const cardPool = Array.from({ length: 22 }, (_, i) => i);
    const shuffled = cardPool.sort(() => Math.random() - 0.5);
    sessions[userId] = shuffled.slice(0, 3); // Store only 3 cards
  }
}

function getCard(userId, index) {
  startSession(userId);
  return sessions[userId]?.[index];
}

function isSessionComplete(userId) {
  return !!sessions[userId];
}

function clearSession(userId) {
  delete sessions[userId];
}

module.exports = {
  startSession,
  getCard,
  isSessionComplete,
  clearSession
};
