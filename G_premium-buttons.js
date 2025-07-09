// G_premium-buttons.js - v1.3.3

const { getPastLife } = require('./G_pastlife');
const { getMirrorMessage } = require('./G_mirror-message');
const { getEnergyReading } = require('./G_energy-reading');
const { getSoulPurpose } = require('./G_soul-purpose');
const { getMessageFromSpirit } = require('./G_message-spirit');
const { getSacredSymbol } = require('./G_sacred-symbol');
const { getDivineTiming } = require('./G_divine-timing');
const { getOracleCard } = require('./G_oracle-card');
const { getHigherSelf } = require('./G_higher-self');

// ✅ 当前有效按钮（已剔除被删除模块）
const PREMIUM_BUTTONS = [
  { text: '🧿 Past Life Echoes', callback_data: 'premium_pastlife' },
  { text: '🪞 Mirror Message', callback_data: 'premium_mirror' },
  { text: '🌀 Energy Reading', callback_data: 'premium_energy' },
  { text: '🔭 Soul Purpose', callback_data: 'premium_purpose' },
  { text: '🌬 Message from Spirit', callback_data: 'premium_spirit' },
  { text: '⛩ Sacred Symbol', callback_data: 'premium_symbol' },
  { text: '⏳ Divine Timing', callback_data: 'premium_timing' },
  { text: '🪄 Oracle Card', callback_data: 'premium_oracle' },
  { text: '🧘 Higher Self', callback_data: 'premium_higher' }
];

// ✅ 一次性渲染所有按钮（不分页）
function renderPremiumButtonsInline() {
  return {
    inline_keyboard: PREMIUM_BUTTONS.map(btn => [{ text: btn.text, callback_data: btn.callback_data }])
  };
}

// ✅ 回调映射表（对应内容生成函数）
const premiumHandlers = {
  premium_pastlife: getPastLife,
  premium_mirror: getMirrorMessage,
  premium_energy: getEnergyReading,
  premium_purpose: getSoulPurpose,
  premium_spirit: getMessageFromSpirit,
  premium_symbol: getSacredSymbol,
  premium_timing: getDivineTiming,
  premium_oracle: getOracleCard,
  premium_higher: getHigherSelf
};

module.exports = {
  renderPremiumButtonsInline,
  premiumHandlers
};
