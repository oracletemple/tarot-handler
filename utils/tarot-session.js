// utils/tarot-session.js
// v1.0.9 - 会话控制模块

const sessions = {};

// ✅ 启动新会话
function startSession(userId) {
  sessions[userId] = {
    drawn: [],
    startedAt: Date.now(),
  };
}

// ✅ 获取指定编号的牌，并记录
function getCard(userId, index) {
  const session = sessions[userId];
  if (!session || session.drawn.includes(index)) return null;

  session.drawn.push(index);
  return {
    index,
    text: `You drew card ${index}. 🃏`, // 后续替换为真实解读
  };
}

// ✅ 判断是否抽完3张
function isSessionComplete(userId) {
  const session = sessions[userId];
  return session && session.drawn.length >= 3;
}

// ✅ 获取已抽张数（用于按钮更新）
function getDrawnCards(userId) {
  const session = sessions[userId];
  return session ? session.drawn : [];
}

module.exports = {
  startSession,
  getCard,
  isSessionComplete,
  getDrawnCards,
};
