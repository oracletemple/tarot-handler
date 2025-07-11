/*
 G_shadow-message.js - v1.0.1
 Always fetch via API. Shadow Message insight capped at 100 words.
*/
const { getDeepseekReply } = require("./G_deepseek");
const MAX_WORDS_SHADOW = 100;

function enforceWordLimitShadow(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

async function getShadowMessage(userId) {
  const prompt = `A user has requested their Shadow Message insight. Provide a compassionate, insightful message to help integrate shadow aspects. Limit your response to no more than ${MAX_WORDS_SHADOW} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `🌑 Shadow Message\n\n${reply}`;
  return enforceWordLimitShadow(result, MAX_WORDS_SHADOW);
}

module.exports = { getShadowMessage };
