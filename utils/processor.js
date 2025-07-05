// v1.1.4
const { sendTarotMessage } = require('./telegram');
const { simulateClick } = require('./simulate-click');

// 配置参数
const AMOUNT_THRESHOLD = parseFloat(process.env.AMOUNT_THRESHOLD || '10');
const RECEIVER_ID = process.env.RECEIVER_ID;

let testCount = 0;

/**
 * 判断金额并处理交易
 * @param {Object} tx - 交易对象
 */
async function handleTransaction(tx) {
  const { amount, sender, hash } = tx;
  const userId = RECEIVER_ID;

  // 记录日志
  console.log(`[TEST] Simulated Tx: ${hash} -> ${amount} USDT`);

  // 推送基础塔罗 + 守护灵等
  await sendTarotMessage(userId, amount, hash);

  // 每档前两笔交易自动模拟点击按钮
  const testIndex = getTestIndex(hash);
  if (testIndex < 2) {
    const cardNumber = 3; // 统一模拟点击第三张牌
    setTimeout(() => {
      simulateClick(userId, cardNumber).catch(err =>
        console.error('[ERROR] Simulate click failed:', err.message)
      );
    }, 800); // 延迟800ms，确保按钮先发送完
  }
}

/**
 * 返回测试编号（test_tx_001 -> 0）
 */
function getTestIndex(hash) {
  const match = hash.match(/test_tx_(\d+)/);
  return match ? (parseInt(match[1], 10) - 1) % 3 : 999;
}

module.exports = { handleTransaction };
