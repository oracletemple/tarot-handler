// -- G_soul-purpose.js - v1.0.1
const { getDeepseekReply: _purpose } = require("./G_deepseek");

async function getPremiumPurpose(userId) {
  const prompt = "Generate a soulful guidance message that helps the user explore their soul purpose, uncovering core motivations, life themes, and steps for living in alignment with their highest calling.";
  const reply = await _purpose(prompt);
  return `🔭 Soul Purpose\n\n${reply}`;
}

module.exports = { getPremiumPurpose };
