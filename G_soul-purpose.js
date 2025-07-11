/*
 G_soul-purpose.js - v1.1.1
 Always fetch via API. Soul Purpose insight capped at 100 words.
*/
const { getDeepseekReply } = require("./G_deepseek");
const MAX_WORDS_SOUL = 100;
function enforceWordLimitSoul(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}
async function getSoulPurpose(userId) {
  const prompt = `A user has requested their Soul Purpose insight. Provide a profound, encouraging reflection on their life mission and gifts. Limit your response to no more than ${MAX_WORDS_SOUL} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `🔭 Soul Purpose\n\n${reply}`;
  return enforceWordLimitSoul(result, MAX_WORDS_SOUL);
}
module.exports = { getSoulPurpose };
