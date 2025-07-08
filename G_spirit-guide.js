// G_spirit-guide.js - v1.0.0

/**
 * 生成一个守护灵信息
 * @returns {string} - 完整的守护灵解读文本（含 emoji + 标题 + 描述）
 */
function getSpiritGuideMessage() {
  const guides = [
    {
      emoji: "🦉",
      name: "Owl",
      meaning: "You are guided by inner wisdom. Trust your intuition and see through illusions."
    },
    {
      emoji: "🐺",
      name: "Wolf",
      meaning: "Your spirit ally is the wolf, symbol of loyalty and intuition. Follow your inner voice."
    },
    {
      emoji: "🦋",
      name: "Butterfly",
      meaning: "You are undergoing a transformation. Embrace the changes and let your soul bloom."
    },
    {
      emoji: "🐢",
      name: "Turtle",
      meaning: "Patience is your power. Steady progress leads to lasting growth and wisdom."
    },
    {
      emoji: "🐬",
      name: "Dolphin",
      meaning: "Joy, play, and emotional intelligence guide you. Connect through heartfelt expression."
    },
    {
      emoji: "🐘",
      name: "Elephant",
      meaning: "You are supported by ancient strength. Honor your roots and move forward with grace."
    },
    {
      emoji: "🐎",
      name: "Horse",
      meaning: "Freedom and power run through you. Break limitations and charge toward your truth."
    },
    {
      emoji: "🐱",
      name: "Cat",
      meaning: "Mystery, independence, and quiet strength guide your soul. Trust your instincts."
    },
    {
      emoji: "🦢",
      name: "Swan",
      meaning: "You are enveloped in elegance and inner peace. Let beauty and calm guide your path."
    },
    {
      emoji: "🐻",
      name: "Bear",
      meaning: "You are protected by strength and grounding energy. Stand tall in your personal power."
    }
  ];

  const chosen = guides[Math.floor(Math.random() * guides.length)];

  return `🌟 *Your Spirit Guide: ${chosen.emoji} ${chosen.name}*\n_${chosen.meaning}_`;
}

module.exports = { getSpiritGuideMessage };
