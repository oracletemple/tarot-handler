// G_tarot-session.js - v1.1.6

const sessions = new Map();

function startSession(userId, amount) {
  const cards = Array.from({ length: 3 }, () => null); // 占位符
  const session = {
    userId,
    amount,
    cards,
    drawn: [],
    createdAt: Date.now()
  };
  sessions.set(userId, session);
  return session;
}

function getSession(userId) {
  return sessions.get(userId);
}

function isSessionComplete(userId) {
  const session = getSession(userId);
  return session && session.drawn.length >= 3;
}

function getCard(userId, index) {
  const session = getSession(userId);
  if (!session) throw new Error('Session not found');
  if (!session.cards || !Array.isArray(session.cards)) throw new Error('Invalid card data');
  if (session.drawn.includes(index)) throw new Error('Card already drawn');

  const tarotDeck = require('./G_card-data');
  const usedCards = session.cards.filter(c => c !== null);
  const availableCards = tarotDeck.filter(card =>
    !usedCards.some(used => used.name === card.name)
  );

  if (availableCards.length === 0) throw new Error('No more unique cards to draw');

  const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)];
  session.cards[index] = randomCard;
  session.drawn.push(index);
  return randomCard;
}

module.exports = {
  startSession,
  getSession,
  getCard,
  isSessionComplete
};
