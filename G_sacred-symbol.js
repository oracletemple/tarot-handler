/*
 G_sacred-symbol.js - v1.0.1
 Always fetch via API. Sacred Symbol insight capped at 100 words.
*/
const { getDeepseekReply } = require("./G_deepseek");
const MAX_WORDS_SYMBOL = 100;
function enforceWordLimitSymbol(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}
async function getSacredSymbol(userId) {
  const prompt = `A user has requested their Sacred Symbol insight. Provide a symbolic, sacred emblem interpretation with guidance. Limit your response to no more than ${MAX_WORDS_SYMBOL} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `⛩ Sacred Symbol\n\n${reply}`;
  return enforceWordLimitSymbol(result, MAX_WORDS_SYMBOL);
}
module.exports = { getSacredSymbol };
