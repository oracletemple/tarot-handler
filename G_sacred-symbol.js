// -- G_sacred-symbol.js - v1.0.1
const { getDeepseekReply: _symbol } = require("./G_deepseek");

async function getPremiumSymbol(userId) {
  const prompt = "Interpret a sacred symbol tailored to the user's situation, explaining its significance, hidden messages, and how they can integrate its wisdom into daily life.";
  const reply = await _symbol(prompt);
  return `⛩ Sacred Symbol\n\n${reply}`;
}

module.exports = { getPremiumSymbol };
