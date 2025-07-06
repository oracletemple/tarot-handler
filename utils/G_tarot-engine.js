// G_tarot-engine.js - v1.1.3

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
 * 获取牌的解读文本（可自定义风格或多语言）
 * @param {object} card - 卡牌对象
 * @returns {string} - 解读字符串
 */
function getCardMeaning(card) {
  return `🃏 *${card.name}*\n\n${card.meaning}`;
}

module.exports = {
  getCardByIndex,
  drawRandomCards,
  getCardMeaning
};
