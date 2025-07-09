// G_tarot-summary.js - v1.2.0

const { getDeepseekReply } = require("./G_deepseek");

const presetSummaries = [
  "Your three cards form a divine triangle, illuminating a journey from struggle to clarity to self-empowerment.",
  "This spread speaks of a powerful transformation—an inner awakening guided by past lessons.",
  "You are emerging from the shadows of confusion into a radiant state of purpose and strength.",
  "A cycle is completing. Now is the time to reclaim your truth and step boldly into what’s next.",
  "These cards weave a tale of spiritual growth. Trust that every challenge is shaping your destiny.",
  "Your path reveals both wounds and wisdom. Healing is your gift—first to yourself, then to others.",
  "The cards reflect an inner revolution. What was hidden is now rising to the surface for integration.",
  "A sacred pause is guiding you. Listen inward. The universe speaks in the silence between events.",
  "You’ve crossed a spiritual threshold. Release the weight of what no longer serves and rise.",
  "This journey speaks of soul contracts, karmic resolution, and a renewal of your inner light.",
  "You are remembering who you truly are—a spark of divinity walking a sacred path.",
  "Each card holds a mirror. What you see is not just prediction, but invitation.",
  "Your spread is a whisper from the cosmos: ‘You are held. You are guided. You are growing.’",
  "The sequence of your cards suggests a rhythm—fall, rise, ascend. Embrace the sacred spiral.",
  "There is beauty even in pain, purpose even in pause. Your spirit is unfolding like a lotus.",
  "This reading confirms: You are exactly where you are meant to be for your highest evolution.",
  "A potent spiritual initiation is unfolding. Be gentle, be courageous, be willing to see.",
  "What lies behind you is wisdom. What lies before you is opportunity. What lies within you is magic.",
  "These cards urge you to step fully into your role as the co-creator of your reality.",
  "The past anchors your roots. The present ignites your fire. The future calls you to fly.",
  "Your cards form a trinity of insight—mind, heart, and soul. Listen to all three."
];

const summaryMemory = new Map();

async function getTarotSummary(userId, cards) {
  if (!summaryMemory.has(userId)) {
    // 🔁 第一次点击：固定文案随机返回
    const random = presetSummaries[Math.floor(Math.random() * presetSummaries.length)];
    summaryMemory.set(userId, true);
    return `🧾 Tarot Summary\n\n${random}`;
  } else {
    // 🔮 第二次及以后：调用 DeepSeek GPT
    const prompt = `Here are three tarot cards that were drawn in a spiritual reading:\n\n- ${cards[0].name}: ${cards[0].meaning}\n- ${cards[1].name}: ${cards[1].meaning}\n- ${cards[2].name}: ${cards[2].meaning}\n\nPlease provide a mystical, symbolic, and emotionally insightful summary that ties the three together into a narrative of transformation or growth. Keep it professional and spiritual.`;
    const reply = await getDeepseekReply(prompt);
    return `🧾 Tarot Summary\n\n${reply}`;
  }
}

module.exports = { getTarotSummary };
