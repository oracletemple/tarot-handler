// G_premium-buttons.js - v1.0.0
const { Markup } = require("telegraf");

/**
 * 根据已点击的模块生成剩余按钮组
 * @param {Object} session - 用户 session 中的 premium 对象
 * @returns {Markup.InlineKeyboardMarkup}
 */
function renderPremiumButtons(session) {
  const all = [
    { key: 'gpt', label: '🌟 GPT Insight' },
    { key: 'summary', label: '📄 Tarot Summary' },
    { key: 'journal', label: '📝 Reflection Prompt' }
  ];

  const remaining = all.filter(b => !session?.premium?.[b.key]);
  const inline_keyboard = remaining.map(btn => [
    Markup.button.callback(btn.label, `premium_${btn.key}`)
  ]);

  return { inline_keyboard };
}

module.exports = { renderPremiumButtons };
