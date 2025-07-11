/*
 G_pastlife.js - v1.0.1
 Always fetch via API. Past Life Echoes insight capped at 100 words.
*/
const { getDeepseekReply } = require("./G_deepseek");
const MAX_WORDS = 100;
function enforceWordLimit(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}
async function getPastLifeEchoes(userId) {
  const prompt = `A user has requested their Past Life Echoes insight. Provide a symbolic, reflective message exploring prior life echoes and their relevance today. Limit your response to no more than ${MAX_WORDS} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `🧿 Past Life Echoes\n\n${reply}`;
  return enforceWordLimit(result, MAX_WORDS);
}
module.exports = { getPastLifeEchoes };
