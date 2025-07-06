// B_transaction.js // v1.1.0

function parseAmountFromText(text) {
  const match = text.match(/(\d+(?:\.\d+)?)\s*USDT/i);
  return match ? parseFloat(match[1]) : null;
}

function getTierFromAmount(amount) {
  if (amount >= 30) return 30;
  if (amount >= 12) return 12;
  return null;
}

module.exports = {
  parseAmountFromText,
  getTierFromAmount
};
