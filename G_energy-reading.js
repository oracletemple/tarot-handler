// -- G_energy-reading.js - v1.2.1
const { getDeepseekReply: _energy } = require("./G_deepseek");

async function getPremiumEnergy(userId) {
  const prompt = "Deliver an intuitive energy reading that captures the user's current energetic state and offers healing guidance to balance their mind, body, and spirit.";
  const reply = await _energy(prompt);
  return `🌀 Energy Reading\n\n${reply}`;
}

module.exports = { getPremiumEnergy };
