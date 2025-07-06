// tarot-session.js - v1.0.10

const sessions = new Map();

export function startSession(userId, amount) {
  sessions.set(userId, {
    amount,
    drawn: {},
    count: 0
  });
}

export function getCard(userId, index) {
  const session = sessions.get(userId);
  if (!session || session.drawn[index]) return null;

  const usedCards = Object.values(session.drawn).map(c => c.name);
  let card;
  do {
    card = getRandomCard();
  } while (usedCards.includes(card.name));

  session.drawn[index] = card;
  session.count++;
  return card;
}

export function isSessionComplete(userId, specificIndex = null) {
  const session = sessions.get(userId);
  if (!session) return true;
  if (specificIndex !== null) return !!session.drawn[specificIndex];
  return session.count >= 3;
}

function getRandomCard() {
  const deck = [...cardData];
  const randomIndex = Math.floor(Math.random() * deck.length);
  return deck[randomIndex];
}

import cardData from './card-data.js';
