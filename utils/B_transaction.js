// B_transaction.js - v1.1.1

/**
 * 交易处理模块（服务内部调用）
 * 根据用户付款金额，模拟触发按钮点击（通常由监听器或 webhook 驱动）
 */

const { simulateButtonClick } = require("./B_simulate-click");

/**
 * 根据付款金额触发模拟占卜流程（仅限 12 / 30 USDT）
 * @param {number} userId - Telegram 用户 ID
 * @param {number} amount - 实际付款金额（12 或 30）
 */
async function handleTransaction(userId, amount) {
  if (amount === 12) {
    // 基础版：自动模拟前两张卡
    await simulateButtonClick(userId, 1, 12);
    await simulateButtonClick(userId, 2, 12);
  } else if (amount === 30) {
    // 高级版：模拟三张卡点击（含深度解读预留）
    await simulateButtonClick(userId, 1, 30);
    await simulateButtonClick(userId, 2, 30);
    await simulateButtonClick(userId, 3, 30);
  } else {
    console.warn(`⚠️ Unknown amount received: ${amount}`);
  }
}

module.exports = {
  handleTransaction
};
