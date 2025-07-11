 G_higher-self.js - v1.1.1
 Always fetch via API. Higher Self insight capped at 100 words.
*/
const { getDeepseekReply } = require("./G_deepseek");
const MAX_WORDS_HIGHER = 100;
function enforceWordLimitHigher(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}
async function getHigherSelf(userId) {
  const prompt = `A user has requested their Higher Self insight. Provide a deeply connective, guiding message from the higher self perspective. Limit your response to no more than ${MAX_WORDS_HIGHER} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `🧘 Higher Self\n\n${reply}`;
  return enforceWordLimitHigher(result, MAX_WORDS_HIGHER);
}
module.exports = { getHigherSelf };
