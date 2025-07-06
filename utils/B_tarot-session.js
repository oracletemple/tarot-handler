// B_tarot-session.js // v1.1.0

const fs = require("fs");
const path = require("path");

const sessions = new Map();
const allCards = require("./B_card-data");

function getRandomCards(count = 3) {
  const shuffled = [...allCards].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function startSession(userId) {
  const cards = getRandomCards();
  sessions.set(userId, {
    cards,
    drawn: [false, false, false],
    createdAt: Date.now()
  });
  return cards;
}

function isSessionComplete(userId) {
  const session = sessions.get(userId);
  if (!session) return true;
  return session.drawn.every(Boolean);
}

function getCard(userId, index) {
  const session = sessions.get(userId);
  if (!session || index < 1 || index > 3) return null;

  session.drawn[index - 1] = true;
  return session.cards[index - 1];
}

function getActiveSession(userId) {
  return sessions.get(userId) || null;
}

module.exports = {
  startSession,
  getCard,
  isSessionComplete,
  getActiveSession
};
