/*
 G_premium-buttons.js - v1.3.1
 Renders premium module buttons and maps callback_data to handlers
*/
const { getPastLifeEchoes } = require("./G_pastlife");
const { getMirrorMessage } = require("./G_mirror-message");
const { getKarmicCycle } = require("./G_karmic-cycle");
const { getEnergyReading } = require("./G_energy-reading");
const { getSoulPurpose } = require("./G_soul-purpose");
const { getMessageSpirit } = require("./G_message-spirit");
const { getSacredSymbol } = require("./G_sacred-symbol");
const { getDivineTiming } = require("./G_divine-timing");
const { getOracleCard } = require("./G_oracle-card");
const { getHigherSelf } = require("./G_higher-self");

// Generate inline keyboard for premium modules
function renderPremiumButtonsInline() {
  return {
    inline_keyboard: [
      [{ text: "🧿 Past Life Echoes", callback_data: "premium_pastlife" }],
      [{ text: "🪞 Mirror Message",    callback_data: "premium_mirror" }],
      [{ text: "🕯 Karmic Cycle",      callback_data: "premium_karma" }],
      [{ text: "🌀 Energy Reading",    callback_data: "premium_energy" }],
      [{ text: "🔭 Soul Purpose",      callback_data: "premium_purpose" }],
      [{ text: "🌬 Message from Spirit", callback_data: "premium_spirit" }],
      [{ text: "⛩ Sacred Symbol",      callback_data: "premium_symbol" }],
      [{ text: "⏳ Divine Timing",      callback_data: "premium_timing" }],
      [{ text: "🪄 Oracle Card",       callback_data: "premium_oracle" }],
      [{ text: "🧘 Higher Self",       callback_data: "premium_higher" }]
    ]
  };
}

// Map callback_data values to handler functions
const premiumHandlers = {
  premium_pastlife: getPastLifeEchoes,
  premium_mirror:   getMirrorMessage,
  premium_karma:    getKarmicCycle,
  premium_energy:   getEnergyReading,
  premium_purpose:  getSoulPurpose,
  premium_spirit:   getMessageSpirit,
  premium_symbol:   getSacredSymbol,
  premium_timing:   getDivineTiming,
  premium_oracle:   getOracleCard,
  premium_higher:   getHigherSelf
};

// Remove clicked button from existing reply_markup
function removeClickedButton(reply_markup, data) {
  const kb = reply_markup.inline_keyboard
    .map(row => row.filter(btn => btn.callback_data !== data))
    .filter(row => row.length > 0);
  return { inline_keyboard: kb };
}

module.exports = { renderPremiumButtonsInline, premiumHandlers, removeClickedButton };
