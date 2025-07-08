// G_oracle-card.js - v1.0.0

/**
 * 抽取一张 Bonus 神谕卡与解释
 */
function getOracleCard() {
  const cards = [
    { name: "Truth", meaning: "Speak it. Seek it. Honor it." },
    { name: "Surrender", meaning: "Let go of the outcome. Trust the process." },
    { name: "Rebirth", meaning: "What is dying is making space for your next self." },
    { name: "Abundance", meaning: "You are allowed to receive without guilt." },
    { name: "Courage", meaning: "You can be scared and still choose to rise." },
    { name: "Alignment", meaning: "What is meant for you cannot miss you." },
    { name: "Mystery", meaning: "Not everything must be known to be trusted." },
    { name: "Awakening", meaning: "Your awareness is shifting. Let the light in." },
    { name: "Healing", meaning: "Your body and soul remember how to restore." },
    { name: "Divine Timing", meaning: "You are not late. You are on sacred time." },
    { name: "Self-Worth", meaning: "You deserve what you keep giving others." },
    { name: "Forgiveness", meaning: "What you release frees *you* the most." },
    { name: "Trust", meaning: "You don’t need to know—just take the next step." },
    { name: "Clarity", meaning: "Stillness will show you what noise cannot." },
    { name: "Protection", meaning: "You are being guided, even in silence." },
    { name: "Expansion", meaning: "You are being stretched for a reason. Make space." }
  ];

  const card = cards[Math.floor(Math.random() * cards.length)];
  return `💫 *Bonus Oracle Card*\n\n**${card.name}** — ${card.meaning}`;
}

module.exports = { getOracleCard };
