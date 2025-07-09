// G_moon-advice.js - v1.1.0

/**
 * 获取当前月相建议（基于简化天文算法，非精准但较贴近真实月相）
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

  // 简化月相计算（基于平均周期与当前日期）
  const today = new Date();
  const synodicMonth = 29.53058867; // 平均朔望月天数
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14)); // 2000年1月6日新月（基准）
  const daysSince = (today.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const currentPhase = daysSince % synodicMonth;

  // 根据当前月相天数判断阶段（划分 8 个阶段）
  const index = Math.floor((currentPhase / synodicMonth) * 8) % 8;
  const phase = moonPhases[index];

  return `🌕 *${phase.name}*\n_${phase.advice}_`;
}

module.exports = { getMoonAdvice };
