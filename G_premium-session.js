// G_premium-session.js - v1.0.0

const { getSession } = require('./G_tarot-session');

/**
 * 标记某个高端模块已点击
 * @param {number} userId
 * @param {string} key - 'gpt' | 'summary' | 'journal'
 */
function markPremiumUsed(userId, key) {
  const session = getSession(userId);
  if (!session.premium) session.premium = {};
  session.premium[key] = true;
}

/**
 * 检查某个模块是否已点击
 */
function isPremiumUsed(userId, key) {
  const session = getSession(userId);
  return !!(session.premium && session.premium[key]);
}

module.exports = {
  markPremiumUsed,
  isPremiumUsed
};
