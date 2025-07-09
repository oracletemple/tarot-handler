// G_premium-buttons.js - v1.3.0
const { premiumModules } = require('./G_premium-modules');

function renderPremiumButtons(session) {
  const remaining = premiumModules.filter(mod => !session.completed.includes(mod.key));
  if (remaining.length === 0) return null;

  const rows = [];
  for (let i = 0; i < remaining.length; i += 3) {
    rows.push(
      remaining.slice(i, i + 3).map(mod => ({
        text: `${mod.icon} ${mod.label}`,
        callback_data: mod.key,
      }))
    );
  }

  return {
    reply_markup: {
      inline_keyboard: rows,
    },
  };
}

function getLoadingMessage() {
  return `🔄 Channeling sacred insight...\n(please allow a few seconds)`;
}

function getHeaderTitle(callbackKey) {
  const mod = premiumModules.find(m => m.key === callbackKey);
  if (!mod) return '🔮 Oracle\'s Message';
  return `🔮 ${mod.label}`;
}

module.exports = {
  renderPremiumButtons,
  getLoadingMessage,
  getHeaderTitle,
};
