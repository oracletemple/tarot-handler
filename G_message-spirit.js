// G_message-spirit.js - v1.2.1

const fixedMessages = [
  "🌬 *A gentle whisper reaches you:* Trust the unfolding of events. Spirit is always near.",
  "🌬 *Message from beyond:* What you seek is also seeking you. Stay open.",
  "🌬 *An echo in the ether says:* You're being guided. Follow your subtle nudges.",
  "🌬 *Spirit says:* You are safe to open your heart again.",
  "🌬 *The wind carries a truth:* Let go to receive something greater.",
  "🌬 *From the unseen realm:* You are not alone. Your presence is felt across dimensions.",
  "🌬 *A sacred whisper:* The answers you seek are already within.",
  "🌬 *A divine note:* Light always returns after darkness. Be patient.",
  "🌬 *Celestial message:* Every delay has a sacred reason.",
  "🌬 *Spirit reminds you:* Breathe deeply. You are exactly where you should be.",
  "🌬 *Message from your guides:* Stillness reveals wisdom. Take a moment to listen.",
  "🌬 *A loving transmission:* You are deeply loved, even when you feel unseen.",
  "🌬 *Ethereal insight:* The future is bright. Keep moving forward.",
  "🌬 *Divine resonance:* Clarity will come after the storm.",
  "🌬 *Spirit affirms:* You are growing in ways you can’t yet see.",
  "🌬 *A message through time:* Past lessons are gifts in disguise.",
  "🌬 *The air whispers:* Miracles gather when you believe.",
  "🌬 *A calling:* Speak your truth, even if your voice trembles.",
  "🌬 *Guidance from beyond:* Surrender opens the doorway to blessings.",
  "🌬 *Spiritual reminder:* Boundaries protect your light.",
  "🌬 *A higher note:* Your energy is your signature — keep it clear and bright."
];

const axios = require("axios");

async function getMessageFromSpirit(userId) {
  if (!getMessageFromSpirit.sessions) getMessageFromSpirit.sessions = new Set();

  const alreadyUsed = getMessageFromSpirit.sessions.has(userId);

  if (alreadyUsed) {
    // 使用 GPT API 生成灵性内容
    const prompt = `As a gentle spirit guide, deliver a comforting spiritual message to the seeker. Use poetic and uplifting language.`;
    try {
      const res = await axios.post(
        "https://api.deepseek.com/v1/chat/completions",
        {
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are a poetic spiritual oracle."
            },
            {
              role: "user",
              content: prompt
            }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer sk-cf17088ece0a4bc985dec1464cf504e1`
          }
        }
      );
      const text = res.data.choices[0].message.content.trim();
      return `🌬 *Spirit says:*\n${text}`;
    } catch (e) {
      return `🌬 *Spirit says:*\nA message is on its way… trust the silence.`;
    }
  } else {
    getMessageFromSpirit.sessions.add(userId);
    const random = fixedMessages[Math.floor(Math.random() * fixedMessages.length)];
    return random;
  }
}

module.exports = { getMessageFromSpirit };
