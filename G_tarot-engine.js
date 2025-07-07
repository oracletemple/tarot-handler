// G_tarot-engine.js - v1.1.4

const cards = require("./G_card-data");

/**
 * 根据指定索引返回一张牌（从预设卡牌数据中读取）
 * @param {number} index - 要抽取的卡牌编号（0~77）
 * @returns {object|null} - 返回卡牌对象或 null
 */
function getCardByIndex(index) {
  return cards.find((card) => card.id === index) || null;
}

/**
 * 从卡组中抽取指定数量的唯一随机牌
 * @param {number} count - 要抽取的牌数量
 * @returns {object[]} - 随机抽取的卡牌数组
 */
function drawRandomCards(count = 3) {
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * 获取带位置标签的解读内容
 * @param {object} card - 卡牌对象
 * @param {number} position - 0: Past, 1: Present, 2: Future
 * @returns {string} - 解读字符串
 */
function getCardMeaning(card, position = 0) {
  const positionMap = {
    0: "🌒 *Past*",
    1: "🌕 *Present*",
    2: "🌘 *Future*"
  };

  const header = positionMap[position] || "*Unknown Position*";
  return `${header}\n🃏 *${card.name}*\n\n${card.meaning}`;
}

module.exports = {
  getCardByIndex,
  drawRandomCards,
  getCardMeaning
};
