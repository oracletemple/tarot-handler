/*
 G_gpt-analysis.js - v1.0.1
 Always fetch via API. GPT Analysis insight capped at 100 words.
*/
const { getDeepseekReply } = require("./G_deepseek");
const MAX_WORDS_GPT = 100;

function enforceWordLimitGpt(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

async function getGptAnalysis(userId) {
  const prompt = `A user has requested a GPT spiritual analysis. Provide a deep, multi-layered interpretation based on their reading, using GPT’s insights. Limit your response to no more than ${MAX_WORDS_GPT} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `🔍 GPT Analysis\n\n${reply}`;
  return enforceWordLimitGpt(result, MAX_WORDS_GPT);
}

module.exports = { getGptAnalysis };
