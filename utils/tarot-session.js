// v1.0.9 - 修复导出缺失 getCard 的问题，完整导出 session 控制逻辑
const sessions = new Map();

export function startSession(userId) {
  const session = {
    drawnCards: [],
    createdAt: Date.now()
  };
  sessions.set(userId, session);
  return session;
}

export function getCard(userId, index) {
  const session = sessions.get(userId);
  if (!session) return null;
  if (session.drawnCards.length >= 3) return null;

  if (!session.drawnCards.includes(index)) {
    session.drawnCards.push(index);
  }
  return { index, total: session.drawnCards.length };
}

export function isSessionComplete(userId) {
  const session = sessions.get(userId);
  if (!session) return false;
  return session.drawnCards.length >= 3;
}
