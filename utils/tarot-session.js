// utils/tarot-session.js
// v1.1.3 - 抽牌状态管理，支持基础与高级一致逻辑

const tarot = require('./tarot');

const sessions = {};

function startSession(userId) {
  if (!sessions[userId]) {
    const cards = tarot.drawCards(3);
    sessions[userId] = { cards, drawn: {} };
  }
}

function getCard(userId, index) {
  const session = sessions[userId];
  if (!session || !session.cards || index < 1 || index > 3) return null;

  const alreadyDrawn = session.drawn[index];
  if (alreadyDrawn) return null;

  const card = session.cards[index - 1];
  session.drawn[index] = true;
  return card;
}

function isSessionComplete(userId) {
  const session = sessions[userId];
  if (!session) return false;

  const drawn = session.drawn;
  return drawn[1] && drawn[2] && drawn[3];
}

module.exports = {
  startSession,
  getCard,
  isSessionComplete,
};
