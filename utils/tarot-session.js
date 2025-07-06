// tarot-session.js - v1.1.0

const sessions = new Map();

export function startSession(userId, amount) {
  const deck = Array.from({ length: 78 }, (_, i) => i);
  shuffle(deck);
  sessions.set(userId, {
    amount,
    deck,
    cardsDrawn: [],
    createdAt: Date.now()
  });
}

export function getCard(userId, index) {
  const session = sessions.get(userId);
  if (!session) return null;

  const cardIndex = session.deck[index];
  if (typeof cardIndex === 'undefined') return null;

  session.cardsDrawn.push(cardIndex);
  return cardIndex;
}

export function removeCardFromSession(userId, cardIndex) {
  const session = sessions.get(userId);
  if (!session) return;

  // 移除指定卡牌，避免重复抽取
  session.deck = session.deck.filter((i) => i !== cardIndex);
}

export function isSessionComplete(userId) {
  const session = sessions.get(userId);
  return session && session.cardsDrawn.length >= 3;
}

export function getSession(userId) {
  return sessions.get(userId);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
