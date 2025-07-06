// B_tarot-engine.js - v1.1.0
const cards = require("./B_card-data");

function getRandomCard() {
  const index = Math.floor(Math.random() * cards.length);
  return cards[index];
}

function getCardById(id) {
  return cards.find((c) => c.id === id);
}

function formatCardMessage(card, index) {
  const position = ["Past", "Present", "Future"][index - 1] || `Card ${index}`;
  const title = `🃏 *${position}: ${card.name}*`;
  const meaning = `_${card.meaning}_`;
  const image = card.image ? `[ ](${card.image})` : "";
  return `${title}\n\n${meaning}${image}`;
}

module.exports = {
  getRandomCard,
  getCardById,
  formatCardMessage
};
