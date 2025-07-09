// G_karma-cycle.js - v1.2.0

const { getDeepseekReply } = require("./G_deepseek");

const presetKarma = [
  "A karmic loop is ending. Choose differently now, and you rewrite your fate.",
  "You’ve been here before—this time, respond with awareness, not reaction.",
  "What you resist returns. What you embrace transforms.",
  "Forgiveness dissolves the karmic tie. Let go—not to forget, but to free your soul.",
  "A recurring lesson signals a soul contract. Are you ready to complete it?",
  "You are not being punished—you are being invited to evolve.",
  "Patterns repeat until wisdom is born. This is your opportunity to transcend.",
  "Release blame. It binds you to the very energy you seek to escape.",
  "Your past is not your prison—it’s your portal to awakening.",
  "What you heal in yourself you heal for generations. This is sacred work."
];

const karmaMemory = new Map();

async function getKarmaCycle(userId) {
  if (!karmaMemory.has(userId)) {
    const index = Math.floor(Math.random() * presetKarma.length);
    karmaMemory.set(userId, true);
    return `🕯 Karmic Cycle\n\n${presetKarma[index]}`;
  } else {
    const prompt = "Offer a mystical and symbolic message about the user's current karmic cycle. Make it feel ancient, spiritual, and awakening. Include themes of choice, release, and evolution.";
    const reply = await getDeepseekReply(prompt);
    return `🕯 Karmic Cycle\n\n${reply}`;
  }
}

module.exports = { getKarmaCycle };
