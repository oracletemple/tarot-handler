// v1.1.0 - utils/tarot.js

const tarotCardData = require("./card-data");
const { sendPhoto, sendMessage } = require("./telegram");
const { getCard } = require("./tarot-session");

async function handleCardClick(userId, index) {
  const cardIndex = getCard(userId, index);
  const card = tarotCardData[cardIndex];

  if (!card) {
    await sendMessage(userId, "An unknown card was drawn. Please try again.");
    return;
  }

  if (card.image) {
    await sendPhoto(userId, card.image, `🃏 ${card.name}\n\n${card.meaning}`);
  } else {
    await sendMessage(userId, `🃏 ${card.name}\n\n${card.meaning}`);
  }
}

module.exports = { handleCardClick };
