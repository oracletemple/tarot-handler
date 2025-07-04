// v1.0.11 - Tarot 卡片图片和名称生成器
function getCardImage(cardNumber) {
  const padded = String(cardNumber).padStart(2, '0');
  return `https://yourdomain.com/cards/${padded}.jpg`;
}

function getCardName(cardNumber) {
  return `Tarot Card #${cardNumber}`;
}

module.exports = {
  getCardImage,
  getCardName,
};
