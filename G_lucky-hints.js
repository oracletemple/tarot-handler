// G_lucky-hints.js - v1.0.0

/**
 * 生成幸运颜色与幸运数字的提示内容
 * @returns {string} - 灵性化的幸运提示文本
 */
function getLuckyHints() {
  const colors = [
    { name: "Gold", meaning: "Attracts abundance and confidence." },
    { name: "Violet", meaning: "Enhances spiritual insight and creativity." },
    { name: "Blue", meaning: "Brings calm, wisdom, and clear communication." },
    { name: "Green", meaning: "Supports healing, growth, and balance." },
    { name: "Red", meaning: "Ignites passion, courage, and action." },
    { name: "White", meaning: "Symbol of purity, clarity, and protection." },
    { name: "Black", meaning: "Grounding energy and spiritual strength." },
    { name: "Yellow", meaning: "Boosts joy, optimism, and mental clarity." },
    { name: "Pink", meaning: "Nurtures love, kindness, and harmony." },
    { name: "Turquoise", meaning: "Protects and promotes spiritual expression." }
  ];

  const luckyNumber = Math.floor(Math.random() * 9) + 1; // 1~9

  const chosenColor = colors[Math.floor(Math.random() * colors.length)];

  return `🎨 *Lucky Color: ${chosenColor.name}*\n_${chosenColor.meaning}_\n\n🔢 *Lucky Number: ${luckyNumber}*\n_Use this number as your symbol of alignment today._`;
}

module.exports = { getLuckyHints };
