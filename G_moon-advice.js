// G_moon-advice.js - v1.0.0

/**
 * 获取当前月相建议（简化版基于日期计算，非天文精准）
 * @returns {string} - 灵性风格的月亮能量建议
 */
function getMoonAdvice() {
  const moonPhases = [
    {
      name: "🌑 New Moon",
      advice: "A powerful time to set intentions and welcome fresh beginnings. Trust the unknown."
    },
    {
      name: "🌒 Waxing Crescent",
      advice: "Focus on your desires. Let your goals take shape and gain clarity with action."
    },
    {
      name: "🌓 First Quarter",
      advice: "Time to overcome obstacles. Push forward with strength and make bold decisions."
    },
    {
      name: "🌔 Waxing Gibbous",
      advice: "Refine your plans. Pay attention to details and align your energy with purpose."
    },
    {
      name: "🌕 Full Moon",
      advice: "A peak of energy. Celebrate what has manifested and release what no longer serves you."
    },
    {
      name: "🌖 Waning Gibbous",
      advice: "Share your insights. Teach, reflect, and give gratitude for your spiritual journey."
    },
    {
      name: "🌗 Last Quarter",
      advice: "Let go of limiting beliefs. Forgive, release, and create space for peace."
    },
    {
      name: "🌘 Waning Crescent",
      advice: "Rest and restore. Listen to your intuition and prepare for a new cycle."
    }
  ];

  const today = new Date();
  const dayOfCycle = today.getDate() % moonPhases.length;
  const phase = moonPhases[dayOfCycle];

  return `🌕 *${phase.name}*\n_${phase.advice}_`;
}

module.exports = { getMoonAdvice };