// v1.1.2
const { Markup } = require('telegraf');
const { getCard, isSessionComplete } = require('./tarot-session');

function getTarotButtons() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🃏 Card 1', 'card_1')],
    [Markup.button.callback('🃏 Card 2', 'card_2')],
    [Markup.button.callback('🃏 Card 3', 'card_3')]
  ]);
}

function handleDrawCard(userId, cardIndex) {
  if (isSessionComplete(userId)) return '✅ All cards have been drawn.';
  const card = getCard(userId, cardIndex);
  return card ? `🔮 You drew: *${card}*` : '❌ Failed to draw card.';
}

module.exports = {
  getTarotButtons,
  handleDrawCard
};
