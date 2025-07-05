// tarot-session.js v1.1.0

const sessionMap = new Map();

function startSession(userId) {
  sessionMap.set(userId, {
    drawn: [],
    startedAt: Date.now(),
  });
  console.log("✅ Session started for", userId);
}

function isSessionComplete(userId) {
  const session = sessionMap.get(userId);
  return session && session.drawn.length >= 3;
}

function getCard(userId, index) {
  const session = sessionMap.get(userId);

  if (!session) {
    console.warn("⚠️ Session not found for", userId);
    return {
      text: "⚠️ Session not found. Please try again later.",
      done: false,
    };
  }

  if (session.drawn.includes(index)) {
    return {
      text: "⚠️ You already drew this card.",
      done: false,
    };
  }

  session.drawn.push(index);
  console.log("🎴 Card", index, "drawn by", userId);

  // 临时示意内容，后续接入正式塔罗文本
  const cardText = `You drew Card ${index}. 🌟 Meaning: Divine insight.`;

  const done = session.drawn.length >= 3;
  if (done) {
    console.log("✅ Session complete for", userId);
  }

  return {
    text: cardText,
    done,
  };
}

function getSession(userId) {
  return sessionMap.get(userId);
}

module.exports = {
  startSession,
  getCard,
  isSessionComplete,
  getSession,
};
