// G_divine-timing.js - v1.1.1
const axios = require("axios");

const presetTimingMessages = [
  "⏳ The doors you long to walk through are not locked—just not yet opened. Trust the tempo.",
  "🌙 Timing is sacred. What delays you now will protect you from what you cannot yet see.",
  "🌿 Like a seed beneath soil, not all growth is visible. Be patient with what is unfolding.",
  "🕰 Your soul is aligning with a higher rhythm. Let go of the need to rush or resist.",
  "🌊 Divine timing flows like the tides—learn to ride it, not race it.",
  "🧘‍♀️ What you seek is already seeking you. Your only task is to remain open and still.",
  "🔮 The universe is weaving unseen threads—trust that you are being guided to right moments.",
  "📿 A divine pause is not punishment. It's preparation for a more aligned unfolding.",
  "🌄 Your sunrise will come. Every shadow you now walk through is part of the dawn’s shaping.",
  "📖 You are not behind. Your timeline is written in sacred ink, not comparison.",
  "🌌 What’s meant for you is not late—it’s simply orbiting into alignment.",
  "🕯 Rest. Divine timing honors those who know how to wait with faith.",
  "🌟 A delay now may lead to a destiny beyond your current imagination.",
  "🛤 You are on the right track, even when it feels still. The tracks extend into mystery.",
  "🍂 Let go of forcing. What’s falling away is making space for divine replacement.",
  "🌀 Divine timing bends linear time. Miracles move when you're fully present.",
  "🌬 When the wind doesn't blow your way, perhaps you're meant to plant, not sail.",
  "🏹 Your arrow is pulled back for a reason. Trust the tension—it’s aiming you toward purpose.",
  "📆 Divine timing isn’t always convenient, but it’s always correct.",
  "🎭 You’re being asked to pause, not quit. Trust the sacred intermission.",
  "🪞 Sometimes your timing must wait for another soul’s readiness too. Be tender with that truth."
];

const usedApiSet = new Set();

// ✅ 主导出函数：统一命名为 getTimingInsight
async function getTimingInsight(userId) {
  if (!usedApiSet.has(userId)) {
    usedApiSet.add(userId);
    const random = Math.floor(Math.random() * presetTimingMessages.length);
    return presetTimingMessages[random];
  } else {
    return await callDeepSeekTiming();
  }
}

// ✅ DeepSeek 灵性时间回应
async function callDeepSeekTiming() {
  const apiKey = "sk-cf17088ece0a4bc985dec1464cf504e1";
  const prompt = `Offer a poetic, mystical reflection about divine timing. Use symbolic metaphors to help the user understand that their path is unfolding in perfect rhythm. Make it spiritually uplifting.`;

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
    console.error("DeepSeek API error (timing):", err.message);
    return "⚠️ The divine clock is silent now. Try again a little later.";
  }
}

module.exports = { getTimingInsight };
