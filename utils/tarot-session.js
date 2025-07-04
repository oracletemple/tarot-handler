// v1.0.11 - Session 模式：支持多轮抽牌与状态判断
const sessions = {};

function startSession(userId, isPremium = false) {
  sessions[userId] = {
    cards: [],
    complete: false,
    premium: isPremium,
  };
}

function getCard(userId, index) {
  const session = sessions[userId];
  if (!session || index < 0 || index > 2) return null;

  const existing = session.cards[index];
  if (existing) return existing;

  const newCard = Math.floor(Math.random() * 78) + 1;
  session.cards[index] = newCard;

  if (session.cards.filter(Boolean).length === 3) {
    session.complete = true;
  }

  return newCard;
}

function isSessionComplete(userId) {
  return sessions[userId]?.complete || false;
}

function isPremium(userId) {
  return sessions[userId]?.premium || false;
}

module.exports = {
  startSession,
  getCard,
  isSessionComplete,
  isPremium,
};
