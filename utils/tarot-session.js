// 📁 文件：utils/tarot-session.js  (v1.1.3)

const sessions = new Map();

function startSession(userId) {
  sessions.set(userId, {
    drawnCards: [],
  });
}

function getCard(userId, index) {
  const session = sessions.get(userId);
  if (!session || session.drawnCards.includes(index)) return null;

  session.drawnCards.push(index);

  // ✅ 模拟生成牌面内容
  const card = {
    image: `https://example.com/tarot/card_${index}.jpg`,
    text: `This is the meaning of Card ${index}.`,
  };
  return card;
}

function isSessionComplete(userId) {
  const session = sessions.get(userId);
  return session && session.drawnCards.length >= 3;
}

function endSession(userId) {
  sessions.delete(userId);
}

module.exports = {
  startSession,
  getCard,
  isSessionComplete,
  endSession,
};
