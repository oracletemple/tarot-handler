// === G_premium-buttons.js (v1.3.2) ===
// Add Tarot Summary button
const { getTarotSummary } = require("./G_tarot-summary");
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
      [{ text: "🧾 Tarot Summary",      callback_data: "premium_summary" }],
      [{ text: "🧿 Past Life Echoes",    callback_data: "premium_pastlife" }],
      [{ text: "🪞 Mirror Message",       callback_data: "premium_mirror" }],
      [{ text: "🕯 Karmic Cycle",         callback_data: "premium_karma" }],
      [{ text: "🌀 Energy Reading",       callback_data: "premium_energy" }],
      [{ text: "🔭 Soul Purpose",         callback_data: "premium_purpose" }],
      [{ text: "🌬 Message from Spirit", callback_data: "premium_spirit" }],
      [{ text: "⛩ Sacred Symbol",         callback_data: "premium_symbol" }],
      [{ text: "⏳ Divine Timing",         callback_data: "premium_timing" }],
      [{ text: "🪄 Oracle Card",          callback_data: "premium_oracle" }],
      [{ text: "🧘 Higher Self",          callback_data: "premium_higher" }]
    ]
  };
}

// Map callback_data values to handler functions
const premiumHandlers = {
  premium_summary: (userId, session) => getTarotSummary(userId, session.cards),
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


// === B_telegram.js Premium Handling Update (v1.5.27) ===
// In the premium module click section, use session-aware handlers
// Replace the premium handling block with:

  // 🌟 高级版模块点击
  if (premiumHandlers[data] && session.amount >= 30) {
    session._premiumHandled = session._premiumHandled || new Set();
    if (session._premiumHandled.has(data)) return;
    session._premiumHandled.add(data);

    await answerCallbackQuery(cb.id);
    await editReplyMarkup(userId, msgId, { inline_keyboard: [[{ text: `Fetching insight...`, callback_data: data }]] });

    try {
      // Use handler with session for summary, or basic userId
      let res;
      if (data === 'premium_summary') {
        res = await premiumHandlers[data](userId, session);
      } else {
        res = await premiumHandlers[data](userId);
      }

      clearInterval(iv2);
      const rb = removeClickedButton(cb.message.reply_markup, data);
      await editReplyMarkup(userId, msgId, rb);
      await sendMessage(userId, res);
      markPremiumClick(userId, data);
    } catch (err) {
      clearInterval(iv2);
      console.error("[premium handling error]", err);
      await sendMessage(userId, `⚠️ Failed to load: ${data}`);
    }
    return;
  }
