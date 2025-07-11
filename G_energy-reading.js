/*
 G_energy-reading.js - v1.2.1
 Always fetch via API. Energy Reading insight capped at 100 words.
*/
const { getDeepseekReply } = require("./G_deepseek");
const MAX_WORDS_ENERGY = 100;
function enforceWordLimitEnergy(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}
async function getEnergyReading(userId) {
  const prompt = `A user has requested their Energy Reading. Provide an intuitive, emotionally resonant message about their current energy field and guidance. Limit your response to no more than ${MAX_WORDS_ENERGY} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `🌀 Energy Reading\n\n${reply}`;
  return enforceWordLimitEnergy(result, MAX_WORDS_ENERGY);
}
module.exports = { getEnergyReading };
