/*
 G_lucky-hints.js - v1.0.3
 Always fetch via API. Lucky Hints capped at 80 words.
*/
const { getDeepseekReply } = require("./G_deepseek");

const MAX_WORDS_HINTS = 80;

function enforceWordLimit(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

async function getLuckyHints(userId) {
  const prompt = `A user has requested their Lucky Hints. Provide a concise, uplifting hint involving color, number, or symbol to enhance daily fortune. Limit your response to no more than ${MAX_WORDS_HINTS} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `🎨 Lucky Hints\n\n${reply}`;
  return enforceWordLimit(result, MAX_WORDS_HINTS);
}

module.exports = { getLuckyHints };

