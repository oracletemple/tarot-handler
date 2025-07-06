// utils/tarot-session.js  // v1.0.9

const { drawCards } = require('./tarot-engine');
const sessions = {};

function startSession(userId) {
  sessions[userId] = {
    cards: drawCards(),
    selected: [false, false, false],
  };
}

function getCard(userId, index) {
  const session = sessions[userId];
  if (!session || session.selected[index]) return null;
  session.selected[index] = true;
  return session.cards[index];
}

function isSessionComplete(userId) {
  const session = sessions[userId];
  return session && session.selected.every(Boolean);
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
