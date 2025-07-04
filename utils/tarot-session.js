// v1.1.0
const sessions = new Map();

function startSession(userId) {
  sessions.set(userId, {
    cards: [],
    current: 0,
    completed: false
  });
}

function getCard(userId, index) {
  const session = sessions.get(userId);
  if (!session || session.completed || index > 2) return null;
  if (!session.cards.length) {
    session.cards = generateCards();
  }
  session.current = index;
  if (index === 2) session.completed = true;
  return session.cards[index];
}

function isSessionComplete(userId) {
  const session = sessions.get(userId);
  return session ? session.completed : false;
}

function generateCards() {
  const tarot = require('./tarot');
  const shuffled = tarot.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

module.exports = { startSession, getCard, isSessionComplete };
