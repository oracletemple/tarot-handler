// utils/transaction.js - v1.0.0 ✅

export function extractTransactionInfo(data) {
  if (!data || typeof data !== 'object') return {};

  const amount = Number(data.amount || 0);
  const user_id = data.user_id || null;
  return { amount, user_id };
}
