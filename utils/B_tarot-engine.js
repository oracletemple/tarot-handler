// B_tarot-engine.js - v1.1.1

/**
 * 根据塔罗牌对象和位置，生成解读文本
 * @param {object} card - 单张牌对象（含 name, meaning, image）
 * @param {number} index - 牌序位置：1=Past，2=Present，3=Future
 * @returns {string} 解读信息（含格式化）
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
