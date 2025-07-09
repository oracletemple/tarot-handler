// G_button-render.js - v1.0.4

function renderCardButtons(session) {
  if (!session || !session.cards || !Array.isArray(session.cards)) {
    console.log("⚠️ Invalid session or card structure.");
    return null;
  }

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

  if (buttons.length === 0) {
    console.log("⚠️ No buttons to render.");
    return null;
  }

  return {
    reply_markup: {
      inline_keyboard: buttons,
    },
  };
}

module.exports = { renderCardButtons };
