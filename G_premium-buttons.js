// G_premium-buttons.js - v1.3.1

const { getPastLife } = require("./G_pastlife");
const { getMirrorMessage } = require("./G_mirror-message");
const { getKarmicCycle } = require("./G_karmic-cycle");
const { getEnergyReading } = require("./G_energy-reading");
const { getSoulPurpose } = require("./G_soul-purpose");
const { getMessageFromSpirit } = require("./G_spirit-message");
const { getSacredSymbol } = require("./G_sacred-symbol");
const { getDivineTiming } = require("./G_divine-timing");
const { getOracleCard } = require("./G_oracle-card");
const { getHigherSelf } = require("./G_higher-self");

const premiumHandlers = {
  premium_pastlife: getPastLife,
  premium_mirror: getMirrorMessage,
  premium_karma: getKarmicCycle,
  premium_energy: getEnergyReading,
  premium_purpose: getSoulPurpose,
  premium_spirit: getMessageFromSpirit,
  premium_symbol: getSacredSymbol,
  premium_timing: getDivineTiming,
  premium_oracle: getOracleCard,
  premium_higher: getHigherSelf
};

const buttonGroups = [
  [
    { text: "🧘 Higher Self", callback_data: "premium_higher" },
    { text: "🪞 Mirror Message", callback_data: "premium_mirror" },
    { text: "🌀 Energy Reading", callback_data: "premium_energy" }
  ],
  [
    { text: "🔭 Soul Purpose", callback_data: "premium_purpose" },
    { text: "🧿 Past Life Echoes", callback_data: "premium_pastlife" },
    { text: "🕯 Karmic Cycle", callback_data: "premium_karma" }
  ],
  [
    { text: "🌬 Message from Spirit", callback_data: "premium_spirit" },
    { text: "⛩ Sacred Symbol", callback_data: "premium_symbol" },
    { text: "⏳ Divine Timing", callback_data: "premium_timing" }
  ],
  [
    { text: "🪄 Oracle Card", callback_data: "premium_oracle" }
  ]
];

function renderPremiumButtons(groupIndex = 0) {
  if (groupIndex < 0 || groupIndex >= buttonGroups.length) return null;
  return {
    reply_markup: {
      inline_keyboard: buttonGroups[groupIndex].map((btn) => [{ text: btn.text, callback_data: btn.callback_data }])
    }
  };
}

function getPremiumHandler(key) {
  return premiumHandlers[key] || null;
}

module.exports = {
  renderPremiumButtons,
  getPremiumHandler,
  buttonGroups
};
