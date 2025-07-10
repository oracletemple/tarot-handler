// -- G_message-spirit.js - v1.0.0
const { getDeepseekReply: _spirit } = require("./G_deepseek");

async function getPremiumSpirit(userId) {
  const prompt = "Share a clear and compassionate message from spirit, conveying supportive insights and gentle wisdom meant to uplift and guide the user's journey.";
  const reply = await _spirit(prompt);
  return `🌬 Message from Spirit\n\n${reply}`;
}

module.exports = { getPremiumSpirit };
