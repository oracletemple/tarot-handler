// -- G_divine-timing.js - v1.0.1
const { getDeepseekReply: _timing } = require("./G_deepseek");

async function getPremiumTiming(userId) {
  const prompt = "Offer divine timing insights, helping the user understand optimal moments for action, patience, or reflection based on spiritual rhythms and cosmic influences.";
  const reply = await _timing(prompt);
  return `⏳ Divine Timing\n\n${reply}`;
}

module.exports = { getPremiumTiming };
