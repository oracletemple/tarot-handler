/*
 G_mirror-message.js - v1.0.1
 Always fetch via API. Mirror Message insight capped at 100 words.
*/
const { getDeepseekReply } = require("./G_deepseek");
const MAX_WORDS_MIRROR = 100;
function enforceWordLimitMirror(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}
async function getMirrorMessage(userId) {
  const prompt = `A user has requested their Mirror Message insight. Provide a deep, symbolic reflection that reveals inner truths and guides self-awareness. Limit your response to no more than ${MAX_WORDS_MIRROR} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `🪞 Mirror Message\n\n${reply}`;
  return enforceWordLimitMirror(result, MAX_WORDS_MIRROR);
}
module.exports = { getMirrorMessage };
