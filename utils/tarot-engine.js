// tarot-handler/utils/tarot-engine.js  // v1.1.1

const tarotCards = require('../data/card-data');

function drawCards(count = 3) {
  // 🚫 避免抽到未定义 meaning 的牌（现在只抽前 3 张）
  const definedCards = tarotCards.slice(0, 3);
  const shuffled = [...definedCards].sort(() => 0.5 - Math.random());

  const selected = shuffled.slice(0, count).map((card, index) => {
    const isReversed = Math.random() < 0.5;
    return {
      id: card.id,
      name: card.name,
      position: isReversed ? 'reversed' : 'upright',
      positionName: index === 0 ? 'Past' : index === 1 ? 'Present' : 'Future',
      image: card.image || null,
      meaning: card.meaning,
    };
  });
  return selected;
}

function formatCardMessage(card, index) {
  return `🃏 <b>Card ${index + 1}: ${card.name} (${card.position}) — ${card.positionName}</b>\n\n` +
         (card.image ? `<a href='${card.image}'>🖼️ View Card Image</a>\n\n` : '') +
         `🌟 <b>Meaning:</b> ${card.meaning?.title || 'N/A'}\n` +
         `❤️ <b>Love Insight:</b> ${card.meaning?.love || 'N/A'}\n` +
         `🧘 <b>Spiritual Advice:</b> ${card.meaning?.advice || 'N/A'}\n` +
         `⚠️ <b>Warning:</b> ${card.meaning?.warning || 'N/A'}`;
}

module.exports = {
  drawCards,
  formatCardMessage
};
