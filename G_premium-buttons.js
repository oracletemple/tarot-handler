// -- G_premium-buttons.js - v1.3.5
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
    { key: 'mirror',  label: '🪞 Mirror Message'       },
    { key: 'energy',  label: '🌀 Energy Reading'    },
    { key: 'purpose', label: '🔭 Soul Purpose'        },
    { key: 'spirit',  label: '🌬 Message from Spirit'  },
    { key: 'symbol',  label: '⛩ Sacred Symbol'        },
    { key: 'timing',  label: '⏳ Divine Timing'       },
    { key: 'oracle',  label: '🪄 Oracle Card'         },
    { key: 'higher',  label: '🧘 Higher Self'         }
  ];

  return {
    inline_keyboard: modules.map(m => [{ text: m.label, callback_data: `premium_${m.key}` }])
  };
}

const premiumHandlers = {
  premium_pastlife: getPremiumPastLife,
  premium_mirror:  getPremiumMirror,
  premium_energy:  getPremiumEnergy,
  premium_purpose: getPremiumPurpose,
  premium_spirit:  getPremiumSpirit,
  premium_symbol:  getPremiumSymbol,
  premium_timing:  getPremiumTiming,
  premium_oracle:  getPremiumOracle,
  premium_higher:  getPremiumHigher
};

function removeClickedButton(currentMarkup, callbackDataToRemove) {
  if (!currentMarkup?.inline_keyboard) return { inline_keyboard: [] };
  const newKb = currentMarkup.inline_keyboard
    .map(row => row.filter(b => b.callback_data !== callbackDataToRemove))
    .filter(row => row.length);
  return { inline_keyboard: newKb };
}

module.exports = {
  renderPremiumButtonsInline,
  premiumHandlers,
  removeClickedButton
};
