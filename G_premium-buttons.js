// G_premium-buttons.js — v1.4.0
const { getPastLife } = require("./G_pastlife");
const { getMirrorMessage } = require("./G_mirror-message");
const { getKarmicCycle } = require("./G_karmic-cycle");
const { getEnergyReading } = require("./G_energy-reading");
const { getSoulPurpose } = require("./G_soul-purpose");
const { getMessageSpirit } = require("./G_message-spirit");
const { getSacredSymbol } = require("./G_sacred-symbol");
const { getDivineTiming } = require("./G_divine-timing");
const { getOracleCard } = require("./G_oracle-card");
const { getHigherSelf } = require("./G_higher-self");
const { getTarotSummary } = require("./G_tarot-summary");
const { getSession } = require("./G_tarot-session");

const premiumButtons = [
  [{ text: "🧿 Past Life Echoes",      callback_data: "premium_pastlife" }],
  [{ text: "🪞 Mirror Message",        callback_data: "premium_mirror" }],
  [{ text: "🕯 Karmic Cycle",           callback_data: "premium_karma" }],
  [{ text: "🌀 Energy Reading",         callback_data: "premium_energy" }],
  [{ text: "🔭 Soul Purpose",           callback_data: "premium_purpose" }],
  [{ text: "🌬 Message from Spirit",    callback_data: "premium_spirit" }],
  [{ text: "⛩ Sacred Symbol",          callback_data: "premium_symbol" }],
  [{ text: "⏳ Divine Timing",          callback_data: "premium_timing" }],
  [{ text: "🪄 Oracle Card",            callback_data: "premium_oracle" }],
  [{ text: "🧘 Higher Self",            callback_data: "premium_higher" }],
  // 新增 Tarot Summary 按钮
  [{ text: "🧾 Tarot Summary",          callback_data: "premium_summary" }]
];

const premiumHandlers = {
  premium_pastlife:    getPastLifeEchoes || getPastLife,
  premium_mirror:      getMirrorMessage,
  premium_karma:       getKarmicCycle,
  premium_energy:      getEnergyReading,
  premium_purpose:     getSoulPurpose,
  premium_spirit:      getMessageSpirit,
  premium_symbol:      getSacredSymbol,
  premium_timing:      getDivineTiming,
  premium_oracle:      getOracleCard,
  premium_higher:      getHigherSelf,
  // 新增 Tarot Summary handler，传入 userId 和已经抽好的三张牌
  premium_summary:     async (userId) => {
    const session = getSession(userId);
    // session.cards 应为 [{name, meaning, image}, ...] 的数组
    return getTarotSummary(userId, session.cards);
  }
};

function renderPremiumButtonsInline() {
  return { inline_keyboard: premiumButtons };
}

module.exports = { renderPremiumButtonsInline, premiumHandlers };
