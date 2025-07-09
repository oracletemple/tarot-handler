// G_tarot-buttons.js - v1.0.0

function getTarotButtons(session) {
  if (!session || !session.cards || !Array.isArray(session.cards)) {
    return { reply_markup: { inline_keyboard: [] } };
  }

  const drawn = session.drawn || [];
  const keyboard = [];

  for (let i = 0; i < 3; i++) {
    if (!drawn.includes(i)) {
      keyboard.push([
        { text: `🃏 Card ${i + 1}`, callback_data: `card_${i}` }
      ]);
    }
  }

  return {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  };
}

module.exports = { getTarotButtons };
