/*
 G_tarot-summary.js - v1.2.3
 Always fetch via API. Deep summary capped at 120 words.
*/
const { getDeepseekReply } = require("./G_deepseek");

const MAX_WORDS_SUMMARY = 120;

function enforceWordLimit(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

async function getTarotSummary(userId, cards) {
  const prompt = `Here are three tarot cards that were drawn in a spiritual reading:\n\n- ${cards[0].name}: ${cards[0].meaning}\n- ${cards[1].name}: ${cards[1].meaning}\n- ${cards[2].name}: ${cards[2].meaning}\n\nPlease provide a mystical, symbolic, and emotionally insightful summary that ties the three together into a narrative of transformation or growth. Keep it professional and spiritual. Limit your response to no more than ${MAX_WORDS_SUMMARY} words.`;
  const reply = await getDeepseekReply(prompt);
  const summary = `🧾 Tarot Summary\n\n${reply}`;
  return enforceWordLimit(summary, MAX_WORDS_SUMMARY);
}

module.exports = { getTarotSummary };
