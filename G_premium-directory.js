/* -------------------- G_premium-directory.js - v1.0.1 ------------------- */
const { getDirectoryData } = require('./G_flow-monitor');

function renderDirectoryButtons(userId) {
  const { clicked, pending } = getDirectoryData(userId);
  const rows = [];
  // 已点击模块，每个按钮单独一行
  clicked.forEach(key => {
    rows.push([{ text: key.charAt(0).toUpperCase() + key.slice(1), callback_data: `nav_${key}` }]);
  });
  // 未点击模块，每个按钮单独一行
  pending.forEach(key => {
    rows.push([{ text: key.charAt(0).toUpperCase() + key.slice(1), callback_data: `premium_${key}` }]);
  });
  return { inline_keyboard: rows };
}

module.exports = { renderDirectoryButtons };

