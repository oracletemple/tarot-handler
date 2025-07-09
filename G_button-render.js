// G_button-render.js - v1.0.3-debug

function renderCardButtons(session) {
  console.log("🧪 Session received for button render:", session);

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

  const result = {
    reply_markup: {
      inline_keyboard: buttons,
    },
  };

  console.log("✅ Rendered card buttons:", JSON.stringify(result, null, 2));
  return result;
}

module.exports = { renderCardButtons };
