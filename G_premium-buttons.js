// G_premium-buttons.js - v1.2.0
const { Markup } = require("telegraf");

/**
 * 渲染所有尚未点击的高端服务按钮（共 16 项）
 */
function renderPremiumButtons(session, page = 1) {
  const all = [
    { key: "gpt", label: "🌟 Celestial Reflection" },   // ✅ 原 GPT Insight
    { key: "summary", label: "📄 Tarot Summary" },
    { key: "journal", label: "📝 Reflection Prompt" },
    { key: "shadow", label: "🔮 Shadow Message" },
    { key: "archetype", label: "💠 Soul Archetype" },
    { key: "higher", label: "📬 Higher Self" },
    { key: "cosmic", label: "🌌 Cosmic Alignment" },
    { key: "oracle", label: "💫 Oracle Card" },
    { key: "pastlife", label: "🧿 Past Life Echoes" },
    { key: "purpose", label: "🔭 Soul Purpose" },
    { key: "karma", label: "🕯 Karmic Cycle" },
    { key: "energy", label: "🌀 Aura Resonance" },      // ✅ 原 Energy Reading
    { key: "timing", label: "⏳ Divine Timing" },
    { key: "symbol", label: "⛩ Sacred Symbol" },
    { key: "spirit", label: "🌬 Message from Spirit" },
    { key: "mirror", label: "🪞 Mirror Message" }
  ];

  const remaining = all.filter(b => !session?.premium?.[b.key]);
  const perPage = 8;
  const totalPages = Math.ceil(remaining.length / perPage);
  const current = remaining.slice((page - 1) * perPage, page * perPage);

  const inline_keyboard = current.map(b => [
    Markup.button.callback(b.label, `premium_${b.key}`)
  ]);

  if (totalPages > 1) {
    const navButtons = [];
    if (page > 1) navButtons.push(Markup.button.callback("⬅️ Prev", `premium_page_${page - 1}`));
    if (page < totalPages) navButtons.push(Markup.button.callback("Next ➡️", `premium_page_${page + 1}`));
    inline_keyboard.push(navButtons);
  }

  return { inline_keyboard };
}

module.exports = { renderPremiumButtons };
