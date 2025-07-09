// G_spirit-guide.js - v1.1.0

/**
 * Return a randomly selected spirit guide message
 * Includes symbolic animal, name, and spiritual meaning
 * @returns {string}
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

  const selected = guides[Math.floor(Math.random() * guides.length)];
  return `🌟 *Your Spirit Guide: ${selected.emoji} ${selected.name}*\n_${selected.meaning}_`;
}

module.exports = { getSpiritGuideMessage };
