// G_karmic-cycle.js - v1.1.0

const fixedMessages = [
  "🕯 *Karmic Cycle Insight*\nYou are breaking free from generational patterns that no longer serve you. This is your time to reset the path forward.",
  "🕯 *Karmic Cycle Insight*\nThe energies of the past may be resurfacing. Reflect deeply on what lesson keeps repeating itself in your life.",
  "🕯 *Karmic Cycle Insight*\nBalance is being restored. What you give is returning. Use this cycle to cleanse and grow.",
  "🕯 *Karmic Cycle Insight*\nYou may be asked to let go of control and trust the timing of your karmic unfolding.",
  "🕯 *Karmic Cycle Insight*\nSome connections in your life are karmic contracts. Learn the lesson, but know when to release them.",
  "🕯 *Karmic Cycle Insight*\nThe pain you’ve endured is not punishment — it’s part of a greater soul recalibration.",
  "🕯 *Karmic Cycle Insight*\nCycles repeat until we awaken. What truth are you avoiding?",
  "🕯 *Karmic Cycle Insight*\nThis is a powerful window to close what was never truly yours, and claim your own spiritual identity.",
  "🕯 *Karmic Cycle Insight*\nThe cycle you’re in now mirrors one from a past life. Use awareness to break the loop.",
  "🕯 *Karmic Cycle Insight*\nYou are not starting from scratch — you’re healing what generations before you couldn’t.",
  "🕯 *Karmic Cycle Insight*\nThis moment invites sacred accountability. Not blame — just truth, and a commitment to shift.",
  "🕯 *Karmic Cycle Insight*\nA karmic contract is dissolving. You are free to step into a new energetic chapter.",
  "🕯 *Karmic Cycle Insight*\nIf you feel stuck, look for the invisible pattern — the unseen root of the cycle.",
  "🕯 *Karmic Cycle Insight*\nKarma is not punishment — it's a mirror. What is life showing you about your energy?",
  "🕯 *Karmic Cycle Insight*\nYou’re being asked to respond differently this time — this breaks the cycle.",
  "🕯 *Karmic Cycle Insight*\nRelease guilt. Karma clears when compassion enters the heart.",
  "🕯 *Karmic Cycle Insight*\nA karmic reset is unfolding. Let go of what feels familiar but no longer resonates.",
  "🕯 *Karmic Cycle Insight*\nPay attention to your dreams — they hold karmic clues from beyond the veil.",
  "🕯 *Karmic Cycle Insight*\nForgiveness is not for them — it’s for you. This is the gateway to ending karmic debt.",
  "🕯 *Karmic Cycle Insight*\nYou are not doomed to repeat the past. You are destined to evolve beyond it.",
  "🕯 *Karmic Cycle Insight*\nEndings are sacred. This cycle completes with your conscious release.",
];

const axios = require("axios");

async function getKarmicCycle(userId) {
  if (!getKarmicCycle.cache) getKarmicCycle.cache = new Set();

  if (!getKarmicCycle.cache.has(userId)) {
    getKarmicCycle.cache.add(userId);
    const random = fixedMessages[Math.floor(Math.random() * fixedMessages.length)];
    return random;
  }

  // 第二次及以后调用：GPT 模式
  const prompt = `The user is exploring karmic cycles. Give a spiritually insightful message (2-3 paragraphs) about the karmic patterns they may be dissolving in their current life. Use compassionate, symbolic language.`;

  try {
    const response = await axios.post(
      "https://api.deepseek.com/chat/completions",
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_KEY}`,
        },
      }
    );

    const text = response.data.choices[0].message.content.trim();
    return `🕯 *Karmic Cycle Insight*\n${text}`;
  } catch (err) {
    console.error("GPT karmic-cycle error:", err.message);
    return "🕯 *Karmic Cycle Insight*\nYou are being called to end old patterns and walk a new soul-aligned path.";
  }
}

module.exports = { getKarmicCycle };
