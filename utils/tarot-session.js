// v1.0.9 - tarot-session.js
const sessions = new Map();

function startSession(userId) {
  sessions.set(userId, {
    cardsDrawn: [],
  });
}

function getCard(userId, index) {
  const session = sessions.get(userId);

  if (!session) {
    return { error: "Session not found. Please try again later." };
  }

  if (session.cardsDrawn.includes(index)) {
    return { error: `You've already drawn card ${index}.` };
  }

  if (session.cardsDrawn.length >= 3) {
    return { error: "You have already drawn 3 cards." };
  }

  // ✅ 模拟牌面文本，可后续替换为真实牌义逻辑
  const cardText = `✨ You have drawn card ${index}. (Placeholder card meaning here.)`;

  session.cardsDrawn.push(index);
  return { text: cardText };
}

function isSessionComplete(userId) {
  const session = sessions.get(userId);
  return session && session.cardsDrawn.length >= 3;
}

module.exports = {
  startSession,
  getCard,
  isSessionComplete,
};
