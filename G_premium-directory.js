// -- G_premium-directory.js - v1.0.0
// 渲染导航目录：已查看 & 待查看模块按钮
const { getDirectoryData } = require('./G_flow-monitor');

function renderDirectoryButtons(userId) {
  const { clicked, pending } = getDirectoryData(userId);
  const rows = [];
  // 已点击模块导航行
  if (clicked.length) {
    const clickedButtons = clicked.map(key => ({ text: key.replace(/^[a-z]/, c=>c.toUpperCase()), callback_data: `nav_${key}` }));
    rows.push(clickedButtons);
  }
  // 未点击模块按钮行
  if (pending.length) {
    const pendingButtons = pending.map(key => ({ text: key.replace(/^[a-z]/, c=>c.toUpperCase()), callback_data: `premium_${key}` }));
    rows.push(pendingButtons);
  }
  return { inline_keyboard: rows };
}

module.exports = { renderDirectoryButtons };

