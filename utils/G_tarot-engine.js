// G_tarot-engine.js - v1.1.1

const cards = require("./G_card-data");

/**
 * 获取完整解读信息
 * @param {object} card - 抽到的卡牌对象（包含 id）
 * @param {string} position - 位置（past/present/future）
 * @returns {object} 解读信息
 */
function generateCardMeaning(card, position) {
  const raw = cards.find(c => c.id === card.id);
  if (!raw) return null;

  const meaning = raw.meaning;
  const name = raw.name;
  const image = raw.image;

  const positionLabel = {
    past: "🕰️ Past Influence",
    present: "🎯 Present Situation",
    future: "🌟 Future Outcome"
  };

  return {
    title: `${positionLabel[position]} - ${name}`,
    meaning: `${meaning}`,
    image: image || null
  };
}

module.exports = { generateCardMeaning };
