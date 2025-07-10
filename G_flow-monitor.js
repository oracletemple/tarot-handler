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
  const count = (s.steps.filter(st => st.startsWith('draw_')).length || 0) + 1;
  s.steps.push('draw_' + count);
}

function markStep(userId, step) {
  const s = sessions.get(userId);
  s.steps.push(step);
}

function markPremiumClick(userId, moduleKey, responseText) {
  const data = flowData.get(userId);
  if (!data.sequence.includes(moduleKey)) data.sequence.push(moduleKey);
  data.responses[moduleKey] = responseText;
  markStep(userId, `premium_${moduleKey}`);
}

function getDirectoryData(userId) {
  const allKeys = ['pastlife','mirror','energy','purpose','spirit','symbol','timing','oracle','higher'];
  const data = flowData.get(userId) || { sequence: [], responses: {} };
  const clicked = data.sequence;
  const pending = allKeys.filter(k => !clicked.includes(k));
  return { clicked, pending, responses: data.responses };
}

function debugFlow(userId) {
  const s = sessions.get(userId) || { steps: [] };
  return `Steps: ${s.steps.join(', ')}`;
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

