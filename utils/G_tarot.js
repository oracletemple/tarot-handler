// G_tarot.js - v1.1.2

const { getCard } = require("./G_tarot-session");
const cardData = require("./G_card-data");

/**
 * 获取指定用户的塔罗牌内容（带图片与英文含义）
 * @param {number} userId - Telegram 用户 ID
 * @param {number} index - 抽第几张牌（1 / 2 / 3）
 * @returns {object} 包含卡片内容：title / meaning / image
 */
function getCardInfo(userId, index) {
  const card = getCard(userId, index);

  if (!card) return null;

  return {
    title: `🔮 ${card.name}`,
    meaning: `✨ *Meaning*: _${card.meaning}_`,
    image: card.image || null,
  };
}

module.exports = {
  getCardInfo,
};
