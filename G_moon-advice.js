/*
 G_moon-advice.js - v1.1.3
 Always fetch via API. Moon Advice capped at 80 words.
*/
const { getDeepseekReply } = require("./G_deepseek");

const MAX_WORDS_MOON = 80;

function enforceWordLimit(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

async function getMoonAdvice(userId) {
  const prompt = `A user has requested Moon Advice based on current lunar phase. Provide a poetic, actionable ritual or reflection. Limit your response to no more than ${MAX_WORDS_MOON} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `🌕 Moon Advice\n\n${reply}`;
  return enforceWordLimit(result, MAX_WORDS_MOON);
}

module.exports = { getMoonAdvice };
