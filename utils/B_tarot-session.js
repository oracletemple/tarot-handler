// B_tarot-session.js - v1.1.2

/**
 * 用户抽牌会话管理模块
 * 用于记录每个用户的三张塔罗牌，并确保流程一次性完成
 */

const sessions = {};

/**
 * 初始化一个新的抽牌 session（通常在收到付款后调用）
 * @param {number} userId - Telegram 用户 ID
 */
function startSession(userId) {
  const drawn = generateThreeCards();
  sessions[userId] = {
    drawn,
    revealed: new Set(),
  };
}

/**
 * 检查用户是否有活跃 session
 * @param {number} userId
 * @returns {boolean}
 */
function exists(userId) {
  return userId in sessions;
}

/**
 * 获取指定用户的某一张牌（索引 1/2/3），并记录为已抽取
 * @param {number} userId
 * @param {number} index - 第几张牌（1, 2, 3）
 * @returns {number} cardId
 */
function getCard(userId, index) {
  const session = sessions[userId];
  if (!session || index < 1 || index > 3) return null;

  session.revealed.add(index);
  return session.drawn[index - 1];
}

/**
 * 判断用户是否已抽完三张牌
 * @param {number} userId
 * @returns {boolean}
 */
function isSessionComplete(userId) {
  const session = sessions[userId];
  return session && session.revealed.size === 3;
}

/**
 * 手动清除一个用户的 session（预留用）
 * @param {number} userId
 */
function clearSession(userId) {
  delete sessions[userId];
}

/**
 * 从完整牌堆中抽取 3 张唯一卡片
 * @returns {number[]} 卡片 ID 数组
 */
function generateThreeCards() {
  const indices = new Set();
  while (indices.size < 3) {
    const rand = Math.floor(Math.random() * 78);
    indices.add(rand);
  }
  return Array.from(indices);
}

module.exports = {
  startSession,
  exists,
  getCard,
  isSessionComplete,
  clearSession,
};
