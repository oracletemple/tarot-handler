// G_button-render.js - v1.0.1

const { getSession } = require("./G_tarot-session");

/**
 * 生成抽牌按钮（仅展示未抽取的牌）
 * @param {number} userId - Telegram 用户 ID
 * @returns {object} - Telegram inline keyboard 格式
 */
function renderCardButtons(userId) {
  const session = getSession(userId);
  if (!session) return { inline_keyboard: [] };

  const buttons = [];

  for (let i = 0; i < 3; i++) {
    if (!session.drawn.includes(i)) {
      buttons.push([
        {
          text: `🃏 Card ${i + 1}`,
          callback_data: `draw_card_${i}_${session.amount}`,
        },
      ]);
    }
  }

  return { inline_keyboard: buttons };
}

module.exports = { renderCardButtons };