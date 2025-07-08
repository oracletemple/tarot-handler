// G_moon-message.js - v1.0.0

/**
 * 获取当前月相并生成灵性建议
 * 结合神秘学元素与自然周期，提升客户信任与共鸣
 */
function getMoonAdvice() {
  const moonPhases = [
    { phase: "🌑 New Moon", advice: "A time to plant new seeds. Embrace fresh beginnings and set your intentions." },
    { phase: "🌒 Waxing Crescent", advice: "Build momentum. Focus on growth and visualize success." },
    { phase: "🌓 First Quarter", advice: "Challenges may arise. Face them boldly — they help you grow stronger." },
    { phase: "🌔 Waxing Gibbous", advice: "Refine your plans. Prepare for fulfillment and trust the process." },
    { phase: "🌕 Full Moon", advice: "Celebrate your progress. Release what no longer serves you and shine bright." },
    { phase: "🌖 Waning Gibbous", advice: "Share your wisdom. Reflect and express gratitude for your journey." },
    { phase: "🌗 Last Quarter", advice: "Let go. Simplify your path and clear the clutter from your spirit." },
    { phase: "🌘 Waning Crescent", advice: "Rest and restore. Prepare your soul for the next cycle of renewal." }
  ];

  const pick = moonPhases[Math.floor(Math.random() * moonPhases.length)];
  return `🌙 *Moon Energy: ${pick.phase}*\n\n_${pick.advice}_`;
}

module.exports = { getMoonAdvice };
