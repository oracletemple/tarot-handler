/*
 G_divine-timing.js - v1.0.1
 Always fetch via API. Divine Timing insight capped at 100 words.
*/
const { getDeepseekReply } = require("./G_deepseek");
const MAX_WORDS_TIMING = 100;
function enforceWordLimitTiming(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}
async function getDivineTiming(userId) {
  const prompt = `A user has requested their Divine Timing insight. Provide a timely, intuitive message about optimal moments and patience. Limit your response to no more than ${MAX_WORDS_TIMING} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `⏳ Divine Timing\n\n${reply}`;
  return enforceWordLimitTiming(result, MAX_WORDS_TIMING);
}
module.exports = { getDivineTiming };
