// G_premium-buttons.js - v1.1.0
const { Markup } = require("telegraf");

/**
 * 渲染所有尚未点击的高端服务按钮（共 8 项）
 */
function renderPremiumButtons(session) {
  const all = [
    { key: "gpt", label: "🌟 GPT Insight" },
    { key: "summary", label: "📄 Tarot Summary" },
    { key: "journal", label: "📝 Reflection Prompt" },
    { key: "shadow", label: "🔮 Shadow Message" },
    { key: "archetype", label: "💠 Soul Archetype" },
    { key: "higher", label: "📬 Higher Self" },
    { key: "cosmic", label: "🌌 Cosmic Alignment" },
    { key: "oracle", label: "💫 Oracle Card" }
  ];

  const remaining = all.filter(b => !session?.premium?.[b.key]);
  const inline_keyboard = remaining.map(b => [Markup.button.callback(b.label, `premium_${b.key}`)]);

  return { inline_keyboard };
}

module.exports = { renderPremiumButtons };
