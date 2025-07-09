// G_divine-timing.js - v1.2.0

const { getDeepseekReply } = require("./G_deepseek");

const presetTimings = [
  "Not now does not mean never. The universe is aligning the details.",
  "Patience is trust in motion. Seeds are sprouting beneath the surface.",
  "The delay is divine. You are being protected from premature growth.",
  "Your soul is syncing with cosmic rhythm—release the urge to rush.",
  "What’s for you will arrive on time, not on demand.",
  "You're not behind. You’re exactly on schedule for your soul’s evolution.",
  "Even the stillness is sacred. Timing weaves unseen threads of magic.",
  "You're in a gestation phase. Nourish the dream without forcing its birth.",
  "When it’s ready, it will flow. Your only task now is trust.",
  "What you’re waiting for is also moving toward you—in perfect timing."
];

const timingMemory = new Map();

async function getDivineTiming(userId) {
  if (!timingMemory.has(userId)) {
    const index = Math.floor(Math.random() * presetTimings.length);
    timingMemory.set(userId, true);
    return `⏳ Divine Timing\n\n${presetTimings[index]}`;
  } else {
    const prompt = "Offer a symbolic, comforting, and spiritually attuned message about divine timing. Reassure the user that the timing of their journey is unfolding with cosmic precision.";
    const reply = await getDeepseekReply(prompt);
    return `⏳ Divine Timing\n\n${reply}`;
  }
}

module.exports = { getDivineTiming };
