// G_premium-buttons.js - v1.3.4
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
  const modules = [
    { key: 'pastlife', label: '🧿 Past Life Echoes' },
    { key: 'mirror', label: '🪞 Mirror Message' },
    { key: 'energy', label: '🌀 Energy Reading' },
    { key: 'purpose', label: '🔭 Soul Purpose' },
    { key: 'spirit', label: '🌬 Message from Spirit' },
    { key: 'symbol', label: '⛩ Sacred Symbol' },
    { key: 'timing', label: '⏳ Divine Timing' },
    { key: 'oracle', label: '🪄 Oracle Card' },
    { key: 'higher', label: '🧘 Higher Self' }
  ];

  const buttons = modules.map(m => [{ text: m.label, callback_data: `premium_${m.key}` }]);
  return { inline_keyboard: buttons };
}

function removeClickedButton(currentMarkup, callbackDataToRemove) {
  if (!currentMarkup || !currentMarkup.inline_keyboard) return { inline_keyboard: [] };

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
