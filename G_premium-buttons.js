// G_premium-buttons.js - v2.0.0
const { Markup } = require("telegraf");

const ALL_PREMIUM_FEATURES = [
  { key: "gpt", label: "🌟 GPT Insight" },
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
  { key: "energy", label: "🌀 Energy Reading" },
  { key: "timing", label: "⏳ Divine Timing" },
  { key: "symbol", label: "⛩ Sacred Symbol" },
  { key: "spirit", label: "🌬 Message from Spirit" },
  { key: "mirror", label: "🪞 Mirror Message" }
];

/**
 * 渲染分页按钮
 * @param {Object} session - 用户 session
 * @param {Number} page - 当前页码（从 1 开始）
 * @returns {Object} Telegram inline_keyboard
 */
function renderPremiumButtons(session, page = 1) {
  const perPage = 4;
  const total = ALL_PREMIUM_FEATURES.length;
  const totalPages = Math.ceil(total / perPage);
  const safePage = Math.max(1, Math.min(page, totalPages));

  const start = (safePage - 1) * perPage;
  const end = start + perPage;

  const used = session?.premium || {};
  const currentButtons = ALL_PREMIUM_FEATURES
    .slice(start, end)
    .filter(b => !used[b.key])
    .map(b => [Markup.button.callback(b.label, `premium_${b.key}`)]);

  const navRow = [];

  if (safePage > 1) {
    navRow.push(Markup.button.callback("◀️ Prev", `premium_page_${safePage - 1}`));
  }

  navRow.push(Markup.button.callback(`📄 Page ${safePage}/${totalPages}`, "noop"));

  if (safePage < totalPages) {
    navRow.push(Markup.button.callback("Next ▶️", `premium_page_${safePage + 1}`));
  }

  if (navRow.length > 0) {
    currentButtons.push(navRow);
  }

  return { inline_keyboard: currentButtons };
}

module.exports = { renderPremiumButtons };
