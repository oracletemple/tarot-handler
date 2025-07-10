/* -------------------- G_premium-directory.js - v1.0.0 ------------------- */
const { getDirectoryData } = require('./G_flow-monitor');

function renderDirectoryButtons(userId) {
  const { clicked, pending } = getDirectoryData(userId);
  const rows = [];
  if (clicked.length) {
    const navBtns = clicked.map(key => ({ text: key.charAt(0).toUpperCase() + key.slice(1), callback_data: `nav_${key}` }));
    rows.push(navBtns);
  }
  if (pending.length) {
    const cmdBtns = pending.map(key => ({ text: key.charAt(0).toUpperCase() + key.slice(1), callback_data: `premium_${key}` }));
    rows.push(cmdBtns);
  }
  return { inline_keyboard: rows };
}

module.exports = { renderDirectoryButtons };

