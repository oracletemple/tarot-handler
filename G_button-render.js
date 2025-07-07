// G_button-render.js - v1.0.2

function renderCardButtons(session) {
  const remaining = [0, 1, 2].filter(i => !session.drawn.includes(i));

  if (remaining.length === 0) return null;

  const keyboard = [
    remaining.map(i => ({
      text: `🃏 Card ${i + 1}`,
      callback_data: `card_${i}_${session.amount}`
    }))
  ];

  return { inline_keyboard: keyboard };
}

module.exports = { renderCardButtons };
