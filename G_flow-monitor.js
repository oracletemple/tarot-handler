/*
 G_flow-monitor.js - v1.1.1
 Tracks end-to-end flow including Tarot Summary as premium step
*/
const flowStatus = new Map(); // key: userId, value: { stage: string, steps: object }

// List of all premium step keys
const PREMIUM_KEYS = [
  "premium_summary",
  "premium_pastlife",
  "premium_mirror",
  "premium_energy",
  "premium_purpose",
  "premium_spirit",
  "premium_symbol",
  "premium_timing",
  "premium_oracle",
  "premium_higher"
];

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
      premiumClicks: {},
    },
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
  if (flow && Object.prototype.hasOwnProperty.call(flow.steps, step)) {
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
  if (!steps.tarotComplete) missing.push("[Tarot not complete]");
  if (!steps.spiritGuide) missing.push("[Spirit guide not sent]");
  if (!steps.luckyHints) missing.push("[Lucky hints not sent]");
  if (!steps.moonAdvice) missing.push("[Moon advice not sent]");
  if (!steps.premiumButtonsShown) missing.push("[Premium buttons not shown]");

  // Check premium summary click
  if (steps.premiumButtonsShown && !steps.premiumClicks["premium_summary"]) {
    missing.push("[Premium not clicked: premium_summary]");
  }

  // Check other premium clicks
  if (steps.premiumButtonsShown) {
    const unclicked = PREMIUM_KEYS.slice(1).filter(key => !steps.premiumClicks[key]);
    unclicked.forEach(key => missing.push(`[Premium not clicked: ${key}]`));
  }

  if (missing.length === 0) {
    return "✅ All flow steps completed.";
  } else {
    return "⚠️ Incomplete flow:" + missing.join(" ");
  }
}

module.exports = {
  startFlow,
  incrementDraw,
  markStep,
  markPremiumClick,
  getFlowStatus,
  debugFlow,
};
