// G_energy-reading.js - v1.1.0
const axios = require("axios");

// ✅ 固定 21 段能量文案（首次点击用）
const presetEnergyMessages = [
  "🌌 Today your aura glows with electric anticipation. Something new is about to spark—stay receptive.",
  "🔥 A surge of creative fire surrounds you. Use it to fuel action, not just inspiration.",
  "🌿 Your energy resonates with grounded renewal. Take a moment to connect with nature today.",
  "💧 Emotions flow freely through your field. Allow yourself to feel without judgment.",
  "🌪 There is movement in your energetic body—change is not coming, it's already happening.",
  "🌞 You radiate confidence and solar strength. Let yourself be seen and heard.",
  "🌫 A fog in your aura suggests inner confusion—clarity will return with rest and stillness.",
  "🌈 Vibrational colors are blooming within. Express yourself creatively today.",
  "🪨 Your energy is firm and rooted. You are unshakable in your truth right now.",
  "🌊 Waves of past energies are surfacing. Do not fear the tides—they're cleansing you.",
  "🌬 You are in alignment with the breath of the universe. Everything is synchronizing.",
  "🌀 Your energetic spiral is expanding. This is a moment of deep spiritual evolution.",
  "🌻 The energy around you is ripe with joy. Let laughter be your medicine.",
  "🌒 A shadow lingers in your field—gently explore what it wants to teach you.",
  "🧲 Your magnetic field is strong. What you focus on will draw near swiftly.",
  "⚡ You are pulsing with divine urgency. It's time to take aligned action.",
  "🌌 Cosmic frequencies are tuning into your crown. Be still and receive.",
  "🧘 Your inner core is vibrating with balance. Let peace be your baseline today.",
  "🕯 Your light is calling to others in silence. You’re guiding without speaking.",
  "🐚 The hum of the deep sea echoes in you—your sensitivity is your superpower.",
  "🔮 An intuitive gateway is open—trust the flashes that appear in your mind’s eye."
];

// ✅ 临时记录用户是否已使用过 API（可改为 session）
const usedApi = new Set();

// ✅ 主调用函数（根据状态选择返回内容）
async function getEnergyReading(userId) {
  if (!usedApi.has(userId)) {
    usedApi.add(userId);
    return getRandomEnergyMessage();
  } else {
    return await getEnergyReadingFromApi();
  }
}

// ✅ 获取随机固定文案（首次点击）
function getRandomEnergyMessage() {
  const i = Math.floor(Math.random() * presetEnergyMessages.length);
  return presetEnergyMessages[i];
}

// ✅ DeepSeek 接口调用（后续点击）
async function getEnergyReadingFromApi() {
  const apiKey = "sk-cf17088ece0a4bc985dec1464cf504e1"; // tarot-bot-key
  const prompt = `Offer a poetic and symbolic spiritual energy reading for the user. Describe the energetic field they may carry today, using vivid metaphors and mystical tone.`;

  try {
    const res = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("❌ DeepSeek API error (energy):", err.message);
    return "⚠️ The energy field is currently unclear. Please try again later.";
  }
}

module.exports = { getEnergyReading };
