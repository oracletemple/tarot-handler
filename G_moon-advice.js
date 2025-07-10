// G_moon-advice.js - v1.2.0
const { getDeepseekReply } = require("./G_deepseek");

/**
 * Provides moon phase based spiritual advice linked to the user's tarot insights.
 */
async function getMoonAdvice(userId) {
  const prompt = "Offer moon phase-based spiritual advice that complements the user's tarot reading, including a simple ritual or reflection suggestion.";
  const reply = await getDeepseekReply(prompt);
  return `🌕 Moon Advice\n\n${reply}`;
}

module.exports = { getMoonAdvice };
