// G_button-render.js - v1.0.2

/**
 * 生成当前还可点击的按钮（已抽卡片会被隐藏）
 * @param {Array<number>} drawn - 已抽的卡片索引列表，如 [0, 2]
 * @param {number} amount - 用户付款金额，用于构造 callback_data（如 12 / 30）
 * @returns {Object} reply_markup 对象，用于 editMessageReplyMarkup
 */
function renderRemainingButtons(drawn, amount) {
  const allButtons = [
    { index: 0, label: "🃏 Card 1" },
    { index: 1, label: "🃏 Card 2" },
    { index: 2, label: "🃏 Card 3" }
  ];

  const remainingButtons = allButtons
    .filter(btn => !drawn.includes(btn.index))
    .map(btn => ({
      text: btn.label,
      callback_data: `card_${btn.index}_${amount}`
    }));

  return {
    inline_keyboard: [remainingButtons]
  };
}

module.exports = { renderRemainingButtons };
