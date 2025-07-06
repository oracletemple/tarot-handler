// B_tarot-engine.js - v1.1.1

/**
 * Generate interpretation message for a card.
 * @param {object} card - Tarot card object
 * @param {number} index - Card position (1/2/3)
 * @returns {string}
 */
function generateCardMessage(card, index) {
  const positionMap = {
    1: "🌅 **Past**",
    2: "🌟 **Present**",
    3: "🌌 **Future**"
  };

  const positionLabel = positionMap[index] || "🃏 Card";

  return `
${positionLabel}
**${card.name}**
_${card.meaning}_

![Card Image](${card.image})
  `.trim();
}

module.exports = {
  generateCardMessage
};
