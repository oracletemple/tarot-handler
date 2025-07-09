// G_higher-self.js - v1.2.0

const fixedMessages = [
  "Your Higher Self reminds you: trust the path, even when it's unclear.",
  "Silence isn't empty. It's full of the answers your soul longs for.",
  "You are not lost. You are recalibrating to your true frequency.",
  "The version of you that you dream of already exists. Walk toward it.",
  "Let go of needing to know all the answers. That’s where magic begins.",
  "Breathe. Your Higher Self is always guiding you with grace.",
  "You carry ancient wisdom in your DNA. Trust your intuition.",
  "You’re allowed to outgrow the old version of you.",
  "Your energy introduces you before you speak. Keep it sacred.",
  "Even your doubts are divine whispers toward clarity.",
  "The present moment is your portal to inner truth.",
  "Growth feels like discomfort because you’re shedding illusions.",
  "You were not born to fit in, but to awaken the world.",
  "Honor your sensitivity; it is your sacred superpower.",
  "There is nothing wrong with you. You are unfolding.",
  "Your Higher Self is not far away. It is the you beneath the noise.",
  "Everything you're seeking is also seeking you.",
  "Your light doesn’t need validation. Just expression.",
  "Every breath is an invitation back to alignment.",
  "You are not behind. You are being refined.",
  "There is divinity in your detour. Trust it."
];

const axios = require("axios");
const apiKey = "sk-cf17088ece0a4bc985dec1464cf504e1"; // DeepSeek API Key

let userRequestCount = new Map();

function getHigherSelfMessage(userId) {
  if (!userRequestCount.has(userId)) {
    userRequestCount.set(userId, 1);
    const message = fixedMessages[Math.floor(Math.random() * fixedMessages.length)];
    return Promise.resolve(`🧘 Higher Self Message:\n"${message}"`);
  } else {
    return fetchDynamicMessage();
  }
}

async function fetchDynamicMessage() {
  try {
    const res = await axios.post(
      "https://api.deepseek.com/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are a mystical Higher Self guide. Provide deep, spiritual, symbolic, yet gentle insights to the user. Respond in a poetic, wise, non-religious style."
          },
          {
            role: "user",
            content:
              "Give me a message from my Higher Self that helps me find clarity and alignment."
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const content = res.data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty response from DeepSeek");
    return `🧘 Higher Self Message:\n"${content.trim()}"`;
  } catch (err) {
    console.error("❌ DeepSeek API Error:", err);
    return "🧘 Higher Self Message:\n" +
      "Your Higher Self is silent for now. Trust the stillness."
  }
}

module.exports = { getHigherSelfMessage };
