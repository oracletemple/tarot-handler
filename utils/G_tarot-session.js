// G_tarot-session.js - v1.1.3

const sessions = new Map();

/**
 * 创建一个新的占卜 session
 * @param {number} userId - Telegram 用户 ID
 * @param {number[]} cards - 抽到的三张牌的索引值
 * @param {number} amount - 付款金额（12 或 30）
 */
function startSession(userId, cards, amount) {
  sessions.set(userId, {
    cards,
    current: 0, // 当前进行到第几张（0~2）
    amount,
    createdAt: Date.now()
  });
}

/**
 * 获取指定用户的当前牌对象（根据索引）
 * @param {number} userId 
 * @param {number} index 
 * @returns {number|null} - 返回卡牌索引值或 null
 */
function getCard(userId, index) {
  const session = sessions.get(userId);
  if (!session || index < 0 || index >= session.cards.length) return null;
  return session.cards[index];
}

/**
 * 获取当前 session 结构
 * @param {number} userId 
 * @returns {object|null}
 */
function getSession(userId) {
  return sessions.get(userId) || null;
}

/**
 * 检查是否存在有效 session
 * @param {number} userId 
 * @returns {boolean}
 */
function exists(userId) {
  return sessions.has(userId);
}

/**
 * 判断用户是否已完成所有抽牌
 * @param {number} userId 
 * @returns {boolean}
 */
function isSessionComplete(userId) {
  const session = sessions.get(userId);
  if (!session) return true;
  return session.current >= session.cards.length;
}

/**
 * 标记用户已点击一张牌（向前推进一格）
 * @param {number} userId 
 */
function advanceSession(userId) {
  const session = sessions.get(userId);
  if (session) {
    session.current += 1;
  }
}

/**
 * 清除某个用户的 session（用于过期或异常时重置）
 * @param {number} userId 
 */
function clearSession(userId) {
  sessions.delete(userId);
}

module.exports = {
  startSession,
  getCard,
  getSession,
  exists,
  isSessionComplete,
  advanceSession,
  clearSession
};
