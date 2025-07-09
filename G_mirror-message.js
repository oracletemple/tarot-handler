// G_mirror-message.js - v1.2.0

const { getDeepseekReply } = require("./G_deepseek");

const presetMirrors = [
  "🪞 The mirror reflects: What frustrates you in others may be what longs for healing within.",
  "🪞 You are not what they told you—you are what you remember when you’re alone with your truth.",
  "🪞 See yourself clearly: even your flaws are part of your sacred design.",
  "🪞 The mirror does not lie. What do you avoid seeing when silence surrounds you?",
  "🪞 Others are mirrors too—offering reflection, not rejection.",
  "🪞 The cracks in your reflection are where your light shines through.",
  "🪞 Look again: your strength was never absent, only waiting to be recognized.",
  "🪞 Your reflection is shifting because you are evolving. Embrace the unknown self.",
  "🪞 Even your shadow has beauty when met with compassion.",
  "🪞 You are the mirror and the reflection—what are you calling back to yourself today?"
];

const mirrorMemory = new Map();

async function getMirrorMessage(userId) {
  if (!mirrorMemory.has(userId)) {
    const index = Math.floor(Math.random() * presetMirrors.length);
    mirrorMemory.set(userId, true);
    return presetMirrors[index];
  } else {
    const prompt = "Offer a symbolic and emotionally insightful mirror message. Help the user reflect on what they may be projecting, avoiding, or needing to see in themselves. Keep it poetic and compassionate.";
    const reply = await getDeepseekReply(prompt);
    return `🪞 Mirror Message\n\n${reply}`;
  }
}

module.exports = { getMirrorMessage };
