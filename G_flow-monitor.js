// G_flow-monitor.js - v1.0.1

const flowStatus = new Map(); // key: userId, value: { stage: string, steps: object }

function startFlow(userId) {
  flowStatus.set(userId, {
    stage: "START",
    steps: {
      started: true,
      drawnCards: 0,
      tarotComplete: false,
      spiritGuide: false,
      luckyHints: false,
      moonAdvice: false,
      premiumButtonsShown: false,
      premiumClicks: {}
    }
  });
}

function incrementDraw(userId) {
  const flow = flowStatus.get(userId);
  if (flow) {
    flow.steps.drawnCards += 1;
    if (flow.steps.drawnCards >= 3) {
      flow.steps.tarotComplete = true;
      flow.stage = "TAROT_DONE";
    }
  }
}

function markStep(userId, step) {
  const flow = flowStatus.get(userId);
  if (flow && flow.steps.hasOwnProperty(step)) {
    flow.steps[step] = true;
  }
}

function markPremiumClick(userId, key) {
  const flow = flowStatus.get(userId);
  if (flow) {
    flow.steps.premiumClicks[key] = true;
  }
}

function getFlowStatus(userId) {
  return flowStatus.get(userId);
}

function debugFlow(userId) {
  const flow = flowStatus.get(userId);
  if (!flow) return "❌ No session found.";
  const steps = flow.steps;

  const missing = [];
  if (!steps.tarotComplete) missing.push("🃏 Tarot not complete");
  if (!steps.spiritGuide) missing.push("🧚 Spirit guide not sent");
  if (!steps.luckyHints) missing.push("🎨 Lucky hints not sent");
  if (!steps.moonAdvice) missing.push("🌕 Moon advice not sent");
  if (!steps.premiumButtonsShown) missing.push("✨ Premium buttons not shown");

  const clicked = Object.keys(steps.premiumClicks || {});
  const clickSummary = clicked.length
    ? `✅ Clicked: ${clicked.join(", ")}`
    : "⚠️ No premium buttons clicked";

  if (missing.length === 0) {
    return `✅ All flow steps completed.\n${clickSummary}`;
  } else {
    return `⚠️ Incomplete flow:\n- ${missing.join("\n- ")}\n${clickSummary}`;
  }
}

module.exports = {
  startFlow,
  incrementDraw,
  markStep,
  markPremiumClick,
  getFlowStatus,
  debugFlow
};
