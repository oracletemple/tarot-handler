// G_premium-buttons.js - v1.1.1
const { Markup } = require("telegraf");

/**
 * 渲染所有尚未点击的高端服务按钮（共 8 项）
 */
function renderPremiumButtons(session) {
  const all = [
    { key: "gpt", label: "🌟 Divine Insight" },
    { key: "summary", label: "🧿 Oracle Vision" },
    { key: "journal", label: "🪞 Inner Reflection" },
    { key: "shadow", label: "🌑 Embrace the Shadow" },
    { key: "archetype", label: "💠 Soul Blueprint" },
    { key: "higher", label: "📬 Whisper from Beyond" },
    { key: "cosmic", label: "🌌 Cosmic Alignment" },
    { key: "oracle", label: "💫 Oracle Blessing" }
  ];

  const remaining = all.filter(b => !session?.premium?.[b.key]);
  const inline_keyboard = remaining.map(b => [Markup.button.callback(b.label, `premium_${b.key}`)]);

  return { inline_keyboard };
}

module.exports = { renderPremiumButtons };
