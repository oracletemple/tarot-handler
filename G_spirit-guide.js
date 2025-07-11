/*
 G_spirit-guide.js - v1.0.4
 Always fetch via API. Spirit Guide capped at 80 words.
*/
const { getDeepseekReply } = require("./G_deepseek");

const MAX_WORDS_SPIRIT = 80;

function enforceWordLimit(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

async function getSpiritGuide(userId) {
  const prompt = `A user has requested their Spirit Guide insight. Provide a mystical, supportive message that feels protective and nurturing. Limit your response to no more than ${MAX_WORDS_SPIRIT} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `🧚 Spirit Guide\n\n${reply}`;
  return enforceWordLimit(result, MAX_WORDS_SPIRIT);
}

module.exports = { getSpiritGuide };
