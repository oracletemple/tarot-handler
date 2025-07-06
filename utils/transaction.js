// utils/transaction.js - v1.0.0

export function extractTransactionInfo(body) {
  if (!body) return {};

  // 🧪 模拟交易测试结构
  if (body.from && body.to && body.amount && body.txid) {
    return {
      user_id: process.env.RECEIVER_ID, // ⚠️ 用环境变量固定目标接收人 ID
      amount: parseFloat(body.amount)
    };
  }

  // ✅ 实际链上数据结构（待适配实际格式）
  if (body.transaction && body.transaction.amount && body.transaction.sender) {
    const amount = parseFloat(body.transaction.amount);
    const user_id = process.env.RECEIVER_ID;
    return { user_id, amount };
  }

  return {};
}
