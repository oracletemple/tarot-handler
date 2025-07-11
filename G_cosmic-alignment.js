/*
 G_cosmic-alignment.js - v1.0.1
 Always fetch via API. Cosmic Alignment insight capped at 100 words.
*/
const { getDeepseekReply } = require("./G_deepseek");
const MAX_WORDS_COSMIC = 100;

function enforceWordLimitCosmic(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

async function getCosmicAlignment(userId) {
  const prompt = `A user has requested their Cosmic Alignment insight. Connect their current energies to planetary or zodiac influences. Limit your response to no more than ${MAX_WORDS_COSMIC} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `🌌 Cosmic Alignment\n\n${reply}`;
  return enforceWordLimitCosmic(result, MAX_WORDS_COSMIC);
}

module.exports = { getCosmicAlignment };
