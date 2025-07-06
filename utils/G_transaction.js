// G_transaction.js - v1.1.3

const RECEIVER_ID = process.env.RECEIVER_ID;
const AMOUNT_THRESHOLD = parseFloat(process.env.AMOUNT_THRESHOLD || "10"); // 最低金额
const TOLERANCE = 0.01; // 漂移容差

/**
 * 判断是否有效交易（大于最小门槛）
 * @param {number} amount 
 * @returns {boolean}
 */
function isValidAmount(amount) {
  return amount >= AMOUNT_THRESHOLD;
}

/**
 * 判断是否为 12 USDT 套餐（基础版）
 * @param {number} amount 
 * @returns {boolean}
 */
function isBasic(amount) {
  return Math.abs(amount - 12) < TOLERANCE;
}

/**
 * 判断是否为 30 USDT 套餐（定制版）
 * @param {number} amount 
 * @returns {boolean}
 */
function isPremium(amount) {
  return Math.abs(amount - 30) < TOLERANCE;
}

module.exports = {
  isValidAmount,
  isBasic,
  isPremium
};
