/*
 G_oracle-card.js - v1.2.1
 Always fetch via API. Oracle Card insight capped at 100 words.
*/
const { getDeepseekReply } = require("./G_deepseek");
const MAX_WORDS_ORACLE = 100;
function enforceWordLimitOracle(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}
async function getOracleCard(userId) {
  const prompt = `A user has requested their Oracle Card insight. Provide a mystical, poetic message drawing on oracular wisdom. Limit your response to no more than ${MAX_WORDS_ORACLE} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `🪄 Oracle Card\n\n${reply}`;
  return enforceWordLimitOracle(result, MAX_WORDS_ORACLE);
}
module.exports = { getOracleCard };
