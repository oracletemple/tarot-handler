// G_button-render.js - v1.0.2

function renderCardButtons(session) {
  if (!session || !session.cards || !Array.isArray(session.cards)) return null;

  const buttons = [];

  for (let i = 0; i < 3; i++) {
    if (!session.drawn.includes(i)) {
      buttons.push([
        {
          text: `🃏 Card ${i + 1}`,
          callback_data: `card_${i}`,
        },
      ]);
    }
  }

  if (buttons.length === 0) return null;

  return {
    reply_markup: {
      inline_keyboard: buttons,
    },
  };
}

module.exports = { renderCardButtons };
