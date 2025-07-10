// -- G_pastlife.js - v1.0.0
const { getDeepseekReply } = require("./G_deepseek");

async function getPremiumPastLife(userId) {
  const prompt = "Provide a rich, symbolic, and introspective past life echo reading for the user, reflecting on themes of karmic patterns, soul lessons, and how past experiences inform their present journey.";
  const reply = await getDeepseekReply(prompt);
  return `🧿 Past Life Echoes\n\n${reply}`;
}

module.exports = { getPremiumPastLife };
