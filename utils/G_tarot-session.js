// G_tarot-session.js - v1.1.3

const sessions = new Map();

/**
 * 启动一轮新占卜：初始化一个用户的 session。
 * @param {number} userId - Telegram 用户 ID
 */
function startSession(userId) {
  sessions.set(userId, {
    cards: [],
    revealed: []
  });
}

/**
 * 判断一个用户是否已有 session。
 * @param {number} userId
 * @returns {boolean}
 */
function exists(userId) {
  return sessions.has(userId);
}

/**
 * 获取当前用户的 session。
 * @param {number} userId
 * @returns {object|null}
 */
function getSession(userId) {
  return sessions.get(userId) || null;
}

/**
 * 判断是否已抽过此牌。
 * @param {number} userId
 * @param {number} index - 第几张牌（1~3）
 * @returns {boolean}
 */
function isSessionComplete(userId, index) {
  const session = sessions.get(userId);
  if (!session) return false;
  return session.revealed.includes(index);
}

/**
 * 获取某张牌（抽取或返回已抽取）
 * @param {number} userId
 * @param {number} index
 * @returns {object|null}
 */
function getCard(userId, index) {
  if (!sessions.has(userId)) return null;

  const session = sessions.get(userId);

  if (session.cards.length < 3) {
    while (session.cards.length < 3) {
      const card = {
        id: Math.floor(Math.random() * 78)
      };
      session.cards.push(card);
    }
  }

  const card = session.cards[index - 1];
  if (!session.revealed.includes(index)) {
    session.revealed.push(index);
  }

  return card;
}

/**
 * 清除 session（暂未使用，可供未来管理功能调用）
 * @param {number} userId
 */
function clearSession(userId) {
  sessions.delete(userId);
}

module.exports = {
  startSession,
  exists,
  getSession,
  getCard,
  isSessionComplete,
  clearSession
};
