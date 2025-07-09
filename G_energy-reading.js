// G_energy-reading.js - v1.1.2
const { callDeepSeek } = require("./G_deepseek");

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

// ✅ 主调用函数：统一命名为 getEnergyInsight
async function getEnergyInsight(userId) {
  if (!usedApi.has(userId)) {
    usedApi.add(userId);
    return getRandomEnergyMessage();
  } else {
    return await getEnergyReadingFromApi();
  }
}

// ✅ 获取随机文案
function getRandomEnergyMessage() {
  const i = Math.floor(Math.random() * presetEnergyMessages.length);
  return presetEnergyMessages[i];
}

// ✅ 调用 DeepSeek 接口（后续使用）
async function getEnergyReadingFromApi() {
  const prompt = `Offer a poetic and symbolic spiritual energy reading for the user. Describe the energetic field they may carry today, using vivid metaphors and mystical tone.`;
  return await callDeepSeek(prompt);
}

module.exports = { getEnergyInsight };
