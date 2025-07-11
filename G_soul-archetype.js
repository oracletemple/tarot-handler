/*
 G_soul-archetype.js - v1.0.1
 Always fetch via API. Soul Archetype insight capped at 100 words.
*/
const { getDeepseekReply } = require("./G_deepseek");
const MAX_WORDS_ARCHETYPE = 100;

function enforceWordLimitArchetype(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

async function getSoulArchetype(userId) {
  const prompt = `A user has requested their Soul Archetype insight. Provide a poetic, symbolic description of their archetype and guidance. Limit your response to no more than ${MAX_WORDS_ARCHETYPE} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `🌀 Soul Archetype\n\n${reply}`;
  return enforceWordLimitArchetype(result, MAX_WORDS_ARCHETYPE);
}

module.exports = { getSoulArchetype };
