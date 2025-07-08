// G_karma.js - v1.0.0
const axios = require("axios");

// ✅ 首次点击时使用的预设文案，共 21 段
const karmicMessages = [
  "🕯 You are repeating a lesson your soul chose to master. Reflect—what keeps circling back?",
  "🔁 The pattern is not punishment; it’s a mirror. What is life trying to show you through repetition?",
  "⛓ Karmic knots are loosening. Forgiveness—not forgetting—is your path to freedom.",
  "🧬 An ancestral thread runs through this. You are the one chosen to break the chain.",
  "🎭 You once played the opposite role in this soul play. See it from the other’s perspective.",
  "🌀 The situation tests your ability to choose differently. This is the karmic fork in the road.",
  "⚖️ What feels unfair may be rebalancing a past imbalance. Trust divine justice.",
  "🪞 You attract what you still need to see in yourself. What does this reflect back to you?",
  "🌑 In the darkness lies the reset. End the cycle by saying: 'No more. I choose peace.'",
  "🕊 Some debts are paid not in suffering, but in compassion. Choose mercy.",
  "🎴 The karmic wheel spins until you no longer react the same way. That is evolution.",
  "📿 You’ve met this soul before. Look into their eyes—do they feel oddly familiar?",
  "🌊 Emotional triggers are echoes from lifetimes past. Surf the wave without drowning in it.",
  "🔮 What if this pain is your soul’s invitation to grow into mastery?",
  "🪐 Karmic closure comes when you stop needing an apology to heal.",
  "💔 The wound is old. The person is new. Don’t confuse the mirror with the origin.",
  "🚪 A karmic portal is open. Step through with conscious intention—or stay in loop.",
  "🎡 Round and round you go, until the lesson is learned. Ask: what is life teaching me?",
  "🌌 You are not cursed—you are conscious. Break the cycle with choice.",
  "🛑 This ends with you. Your awareness is the sword that cuts the karmic thread.",
  "🌱 Where pain once rooted, plant understanding. Let this be the new seed."
];

// ✅ 已调用过 API 的用户记录
const usedApiSet = new Set();

// 🔄 获取业力信息
function getKarmicMessage(userId) {
  if (!usedApiSet.has(userId)) {
    usedApiSet.add(userId);
    const random = Math.floor(Math.random() * karmicMessages.length);
    return karmicMessages[random];
  } else {
    return callDeepSeekKarma(); // 再次点击则调用 AI
  }
}

// 🔮 DeepSeek API 调用逻辑
async function callDeepSeekKarma() {
  const apiKey = "sk-cf17088ece0a4bc985dec1464cf504e1"; // tarot-bot-key
  const prompt = `Provide a symbolic, mystical and reflective message about the user's current karmic cycle. Use poetic, spiritual, and archetypal language.`;

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("DeepSeek API error (karma):", err.message);
    return "⚠️ The karmic veil is too thick right now. Try again in a moment of stillness.";
  }
}

module.exports = { getKarmicMessage };
