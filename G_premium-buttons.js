// G_premium-buttons.js - v1.3.3

const { getPremiumPastLife } = require("./G_pastlife");
const { getPremiumMirror } = require("./G_mirror-message");
const { getPremiumEnergy } = require("./G_energy-reading");
const { getPremiumPurpose } = require("./G_soul-purpose");
const { getPremiumSpirit } = require("./G_message-spirit");
const { getPremiumSymbol } = require("./G_sacred-symbol");
const { getPremiumTiming } = require("./G_divine-timing");
const { getPremiumOracle } = require("./G_oracle-card");
const { getPremiumHigher } = require("./G_higher-self");

function renderPremiumButtonsInline() {
  return {
    inline_keyboard: [
      [{ text: "🧟 Past Life Echoes", callback_data: "premium_pastlife" }],
      [{ text: "🪞 Mirror Message", callback_data: "premium_mirror" }],
      [{ text: "🌀 Energy Reading", callback_data: "premium_energy" }],
      [{ text: "🔭 Soul Purpose", callback_data: "premium_purpose" }],
      [{ text: "🌌 Message from Spirit", callback_data: "premium_spirit" }],
      [{ text: "⛩ Sacred Symbol", callback_data: "premium_symbol" }],
      [{ text: "⏳ Divine Timing", callback_data: "premium_timing" }],
      [{ text: "🪄 Oracle Card", callback_data: "premium_oracle" }],
      [{ text: "🧘 Higher Self", callback_data: "premium_higher" }]
    ]
  };
}

function removeClickedButton(currentMarkup, callbackDataToRemove) {
  if (!currentMarkup || !currentMarkup.inline_keyboard) return null;

  const newKeyboard = currentMarkup.inline_keyboard
    .map(row => row.filter(btn => btn.callback_data !== callbackDataToRemove))
    .filter(row => row.length > 0);

  return { inline_keyboard: newKeyboard };
}

const premiumHandlers = {
  premium_pastlife: getPremiumPastLife,
  premium_mirror: getPremiumMirror,
  premium_energy: getPremiumEnergy,
  premium_purpose: getPremiumPurpose,
  premium_spirit: getPremiumSpirit,
  premium_symbol: getPremiumSymbol,
  premium_timing: getPremiumTiming,
  premium_oracle: getPremiumOracle,
  premium_higher: getPremiumHigher
};

module.exports = {
  renderPremiumButtonsInline,
  premiumHandlers,
  removeClickedButton
};
