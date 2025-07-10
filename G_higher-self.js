// -- G_higher-self.js - v1.0.1
const { getDeepseekReply: _higher } = require("./G_deepseek");

async function getPremiumHigher(userId) {
  const prompt = "Channel guidance from the higher self, offering profound introspection and encouragement for the user's personal evolution and spiritual growth.";
  const reply = await _higher(prompt);
  return `🧘 Higher Self\n\n${reply}`;
}

module.exports = { getPremiumHigher };
