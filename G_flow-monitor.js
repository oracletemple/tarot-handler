// G_flow-monitor.js - v1.1.0

const flowStatus = new Map(); // key: userId, value: { stage, steps }

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
  console.log(`📊 Flow started for user ${userId}`);
}

function incrementDraw(userId) {
  const flow = flowStatus.get(userId);
  if (flow) {
    flow.steps.drawnCards += 1;
    console.log(`🃏 Card drawn (${flow.steps.drawnCards}/3) for user ${userId}`);
    if (flow.steps.drawnCards >= 3) {
      flow.steps.tarotComplete = true;
      flow.stage = "TAROT_DONE";
      console.log(`✅ Tarot complete for user ${userId}`);
    }
  }
}

function markStep(userId, step) {
  const flow = flowStatus.get(userId);
  if (flow && flow.steps.hasOwnProperty(step)) {
    flow.steps[step] = true;
    console.log(`📍 Step marked: ${step} for user ${userId}`);
  }
}

function markPremiumClick(userId, key) {
  const flow = flowStatus.get(userId);
  if (flow) {
    flow.steps.premiumClicks[key] = true;
    console.log(`🔮 Premium click: ${key} by user ${userId}`);
  }
}

function getFlowStatus(userId) {
  return flowStatus.get(userId);
}

function getFlowState(userId) {
  return flowStatus.get(userId) || {};
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

  const unfinishedPremium = [];
  for (const key of Object.keys(premiumButtonKeys)) {
    if (!steps.premiumClicks[key]) {
      unfinishedPremium.push(key);
    }
  }

  if (missing.length === 0 && unfinishedPremium.length === 0) {
    return "✅ All flow steps completed.";
  } else {
    return (
      "⚠️ Incomplete flow: " +
      [...missing, ...(unfinishedPremium.length ? ["[Unclicked: " + unfinishedPremium.join(", ") + "]"] : [])].join(
        " "
      )
    );
  }
}

// 注册的高端模块 key，用于检查是否全部点击
const premiumButtonKeys = {
  premium_pastlife: true,
  premium_mirror: true,
  premium_energy: true,
  premium_purpose: true,
  premium_spirit: true,
  premium_symbol: true,
  premium_timing: true,
  premium_oracle: true,
  premium_higher: true,
};

module.exports = {
  startFlow,
  incrementDraw,
  markStep,
  markPremiumClick,
  getFlowStatus,
  getFlowState,
  debugFlow,
};
