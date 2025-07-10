// -- G_oracle-card.js - v1.2.1
const { getDeepseekReply: _oracle } = require("./G_deepseek");

async function getPremiumOracle(userId) {
  const prompt = "Draw upon the wisdom of an oracle card to deliver a concise, powerful message for the user, focusing on clarity, empowerment, and next steps.";
  const reply = await _oracle(prompt);
  return `🪄 Oracle Card\n\n${reply}`;
}

module.exports = { getPremiumOracle };
