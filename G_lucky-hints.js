// G_lucky-hints.js - v1.1.0
const { getDeepseekReply } = require("./G_deepseek");

/**
 * Generates a personalized Lucky Hints message with color and number based on user energy.
 */
async function getLuckyHints(userId) {
  const prompt = "Generate a personalized lucky hint for the user, including a vibrant color and a meaningful number, inspired by their energy and the current date.";
  const reply = await getDeepseekReply(prompt);
  return `🎨 Lucky Hints\n\n${reply}`;
}

module.exports = { getLuckyHints };
