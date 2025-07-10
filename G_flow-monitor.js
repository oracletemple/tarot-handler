// -- G_flow-monitor.js - v1.0.1
// 增加对话记录，模块流程跟踪与导航数据存储
const sessions = new Map();
const flowData = new Map();

function startFlow(userId) {
  sessions.set(userId, { steps: [] });
  flowData.set(userId, { sequence: [], responses: {} });
}

function getSession(userId) {
  return sessions.get(userId);
}

function isSessionComplete(userId) {
  const s = sessions.get(userId);
  return s && s.steps.includes('premiumButtonsShown');
}

function incrementDraw(userId) {
  const s = sessions.get(userId);
  s.steps.push('draw_' + (s.steps.filter(st => st.startsWith('draw_')).length + 1));
}

function markStep(userId, step) {
  const s = sessions.get(userId);
  s.steps.push(step);
}

// 记录高级模块点击及其返回内容
function markPremiumClick(userId, moduleKey, responseText) {
  const data = flowData.get(userId);
  if (!data.sequence.includes(moduleKey)) data.sequence.push(moduleKey);
  data.responses[moduleKey] = responseText;
}

// 获取导航目录数据
function getDirectoryData(userId) {
  const keys = ['pastlife','mirror','energy','purpose','spirit','symbol','timing','oracle','higher'];
  const data = flowData.get(userId) || { sequence: [], responses: {} };
  const clicked = data.sequence;
  const pending = keys.filter(k => !clicked.includes(k));
  return { clicked, pending, responses: data.responses };
}

function debugFlow(userId) {
  const s = sessions.get(userId) || {};
  return `Steps: ${s.steps || []}`;
}

module.exports = {
  startFlow,
  getSession,
  isSessionComplete,
  incrementDraw,
  markStep,
  markPremiumClick,
  getDirectoryData,
  debugFlow
};
