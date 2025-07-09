// G_premium-buttons.js - v1.4.0

const PREMIUM_BUTTON_GROUPS = [
  [
    { text: "🧿 Past Life Echoes", callback_data: "premium_pastlife" },
    { text: "🔭 Soul Purpose", callback_data: "premium_purpose" },
    { text: "🕯 Karmic Cycle", callback_data: "premium_karma" }
  ],
  [
    { text: "🌀 Energy Reading", callback_data: "premium_energy" },
    { text: "⏳ Divine Timing", callback_data: "premium_timing" },
    { text: "⛩ Sacred Symbol", callback_data: "premium_symbol" }
  ],
  [
    { text: "🌬 Message from Spirit", callback_data: "premium_spirit" },
    { text: "🪞 Mirror Message", callback_data: "premium_mirror" },
    { text: "📜 Journal Prompt", callback_data: "premium_journal" }
  ],
  [
    { text: "🪄 Oracle Card", callback_data: "premium_oracle" },
    { text: "🧘 Higher Self", callback_data: "premium_higher" }
  ]
];

const userPremiumProgress = new Map(); // userId -> current group index

function getNextButtonGroup(userId) {
  const currentIndex = userPremiumProgress.get(userId) || 0;
  if (currentIndex >= PREMIUM_BUTTON_GROUPS.length) return null;
  const group = PREMIUM_BUTTON_GROUPS[currentIndex];
  userPremiumProgress.set(userId, currentIndex + 1);
  return group;
}

function resetPremiumProgress(userId) {
  userPremiumProgress.set(userId, 0);
}

module.exports = {
  getNextButtonGroup,
  resetPremiumProgress
};
