// G_spirit-guide.js - v1.1.0
const { getDeepseekReply } = require("./G_deepseek");

/**
 * Generates a personalized Spirit Guide message based on user's tarot insights.
 */
async function getSpiritGuide(userId) {
  const prompt = "Offer a rich, symbolic spirit guide message that reflects the user's recent tarot reading and provides uplifting, intuitive guidance.";
  const reply = await getDeepseekReply(prompt);
  return `🧚 Spirit Guide\n\n${reply}`;
}

module.exports = { getSpiritGuide };
