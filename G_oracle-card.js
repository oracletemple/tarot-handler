// G_oracle-card.js - v1.2.0
const axios = require("axios");

const presetOracleCards = [
  "🦋 *Transformation*\nEmbrace the winds of change. You are being reshaped for something greater.",
  "🪞 *Reflection*\nWhat you see in others is a mirror of yourself. Look within.",
  "🗝 *Unlocking*\nA hidden truth is ready to reveal itself. Be willing to accept it.",
  "🔥 *Passion*\nLet your inner fire guide you forward. Pursue what lights you up.",
  "🌿 *Healing*\nNow is a time for restoration—physically, emotionally, and spiritually.",
  "🕊 *Peace*\nLay down your worries. Inner stillness brings clarity.",
  "🌀 *Flow*\nRelease resistance. Allow life to unfold in its perfect rhythm.",
  "🌙 *Intuition*\nYour inner voice knows the way. Trust it more than logic.",
  "💎 *Clarity*\nTruth is cutting through confusion. Welcome the light.",
  "🪶 *Signs*\nMessages are all around. Pay attention to synchronicities.",
  "🌈 *Hope*\nEven in darkness, a new dawn is forming. Believe in it.",
  "🧭 *Direction*\nYou are not lost. The universe is gently steering you forward.",
  "🔮 *Vision*\nA future glimpse is coming into focus. Stay aligned.",
  "🌺 *Compassion*\nExtend kindness—to yourself, and others. Grace is power.",
  "⏳ *Timing*\nNot now doesn't mean never. Divine order is in play.",
  "🛡 *Protection*\nYou are surrounded by unseen guardians. Proceed boldly.",
  "⚖ *Balance*\nRestore equilibrium—between giving and receiving, doing and being.",
  "📿 *Sacredness*\nTreat this moment as holy. Your presence is a blessing.",
  "🚪 *Opportunity*\nA new doorway is opening. Say yes to the unknown.",
  "🌌 *Expansion*\nYour spirit is stretching. Growth is sometimes uncomfortable but always worth it.",
  "📖 *Wisdom*\nA lesson is repeating. Are you listening differently this time?"
];

const usedApiSet = new Set();

function getOracleCardMessage(userId) {
  if (!usedApiSet.has(userId)) {
    usedApiSet.add(userId);
    const random = Math.floor(Math.random() * presetOracleCards.length);
    return `🔮 *Oracle Card*\n\n${presetOracleCards[random]}`;
  } else {
    return callDeepSeekOracle();
  }
}

async function callDeepSeekOracle() {
  const apiKey = "sk-cf17088ece0a4bc985dec1464cf504e1";
  const prompt = `Offer a symbolic oracle card message. Include a poetic card title and 1–2 sentence message that speaks with mystical insight and inner guidance.`;

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        }
      }
    );

    return `🔮 *Oracle Card*\n\n${response.data.choices[0].message.content.trim()}`;
  } catch (err) {
    console.error("DeepSeek API error (oracle):", err.message);
    return "⚠️ The oracle is silent for now. Try again later.";
  }
}

module.exports = { getOracleCardMessage };
