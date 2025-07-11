// G_tarot-summary.js — v1.3.1
const { getDeepseekReply } = require("./G_deepseek");

async function getTarotSummary(userId, cards) {
  const prompt =
    `Here are three tarot cards that were drawn in a spiritual reading:\n\n` +
    `- ${cards[0].name}: ${cards[0].meaning}\n` +
    `- ${cards[1].name}: ${cards[1].meaning}\n` +
    `- ${cards[2].name}: ${cards[2].meaning}\n\n` +
    `Please provide a mystical, symbolic, and emotionally insightful summary that ties the three together into a narrative of transformation or growth. ` +
    `Keep it professional and spiritual. Please limit your response to under 500 characters.`;

  const reply = await getDeepseekReply(prompt);
  return `🧾 Tarot Summary\n\n${reply}`;
}

module.exports = { getTarotSummary };
