// G_premium-buttons.js - v1.3.0

const { Markup } = require("telegraf");

// 分组结构，每组最多 3 个按钮
const premiumButtonGroups = [
  [
    { label: "🧿 Past Life Echoes", callback_data: "premium_pastlife" },
    { label: "🔭 Soul Purpose", callback_data: "premium_purpose" },
    { label: "🕯 Karmic Cycle", callback_data: "premium_karma" }
  ],
  [
    { label: "🌀 Energy Reading", callback_data: "premium_energy" },
    { label: "⏳ Divine Timing", callback_data: "premium_timing" },
    { label: "⛩ Sacred Symbol", callback_data: "premium_symbol" }
  ],
  [
    { label: "🌬 Message from Spirit", callback_data: "premium_spirit" },
    { label: "🪞 Mirror Message", callback_data: "premium_mirror" },
    { label: "🪄 Oracle Card", callback_data: "premium_oracle" }
  ],
  [
    { label: "🧘 Higher Self", callback_data: "premium_higher" },
    { label: "🌌 Cosmic Alignment", callback_data: "premium_cosmic" },
    { label: "🪶 Soul Archetype", callback_data: "premium_archetype" }
  ],
  [
    { label: "📝 Journal Prompt", callback_data: "premium_journal" },
    { label: "🌑 Shadow Message", callback_data: "premium_shadow" },
    { label: "🔮 Tarot Summary", callback_data: "premium_summary" }
  ]
];

function getPremiumButtonsByGroup(groupIndex) {
  if (groupIndex < 0 || groupIndex >= premiumButtonGroups.length) return null;
  const buttons = premiumButtonGroups[groupIndex].map((btn) => [Markup.button.callback(btn.label, btn.callback_data)]);
  return Markup.inlineKeyboard(buttons);
}

function getNextPremiumGroupIndex(currentCallbackData) {
  for (let i = 0; i < premiumButtonGroups.length; i++) {
    const group = premiumButtonGroups[i];
    if (group.some(btn => btn.callback_data === currentCallbackData)) {
      return i + 1 < premiumButtonGroups.length ? i + 1 : null;
    }
  }
  return null;
}

module.exports = { getPremiumButtonsByGroup, getNextPremiumGroupIndex };
