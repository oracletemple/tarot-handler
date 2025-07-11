/*
 G_karmic-cycle.js - v1.0.1
 Always fetch via API. Karmic Cycle insight capped at 100 words.
*/
const { getDeepseekReply } = require("./G_deepseek");
const MAX_WORDS_KARMA = 100;
function enforceWordLimitKarma(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}
async function getKarmicCycle(userId) {
  const prompt = `A user has requested their Karmic Cycle insight. Provide a reflective, transformative message that clarifies recurring life patterns and lessons. Limit your response to no more than ${MAX_WORDS_KARMA} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `🕯 Karmic Cycle\n\n${reply}`;
  return enforceWordLimitKarma(result, MAX_WORDS_KARMA);
}
module.exports = { getKarmicCycle };
