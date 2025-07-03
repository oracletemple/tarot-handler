// utils/tarot-session.js

const { generateThreeCardReading } = require('./tarot');

const sessionMap = new Map();

function startSession(userId) {
  const reading = generateThreeCardReading();
  sessionMap.set(userId, {
    cards: reading,
    revealed: [false, false, false],
  });
}

function getCard(userId, index) {
  const session = sessionMap.get(userId);
  if (!session || session.revealed[index]) return null;
  session.revealed[index] = true;
  return session.cards[index];
}

function isSessionComplete(userId) {
  const session = sessionMap.get(userId);
  return session && session.revealed.every(Boolean);
}

function getFullReading(userId) {
  const session = sessionMap.get(userId);
  if (!session) return null;
  const [card1, card2, card3] = session.cards;
  return (
    `🔮 Your Full Tarot Reading:\n\n` +
    `🃏 Past – ${card1.name} (${card1.orientation})\n${card1.meaning}\n\n` +
    `🃏 Present – ${card2.name} (${card2.orientation})\n${card2.meaning}\n\n` +
    `🃏 Future – ${card3.name} (${card3.orientation})\n${card3.meaning}\n\n` +
    `✨ Trust the path ahead. You are being divinely guided.`
  );
}

module.exports = {
  startSession,
  getCard,
  isSessionComplete,
  getFullReading,
};
