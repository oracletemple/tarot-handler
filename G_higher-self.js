// G_higher-self.js - v1.1.0
const axios = require("axios");

const presetMessages = [
  "🌟 Your Higher Self whispers: *You are already whole. Stop chasing what is within.*",
  "🕊 Trust the silence—*in stillness, your Higher Self speaks loudest.*",
  "🔥 *You were not born to shrink.* Let your light be unapologetic today.",
  "🌈 You are walking a sacred path—*even when lost, your soul remembers the way.*",
  "💎 Your worth is not earned—*it is inherent. Embody it.*",
  "🧭 *You are the compass.* Stop asking others for directions to your destiny.",
  "🌿 *Healing is your birthright.* Rest without guilt.",
  "🌕 You are not behind—*you are in rhythm with your unique unfolding.*",
  "🪞 *See yourself as the universe sees you—limitless, radiant, divine.*",
  "🦋 Transformation isn’t becoming something new—*it’s remembering who you are.*",
  "🧘‍♀️ Your Higher Self says: *Release the need to be understood. Be true instead.*",
  "🔮 There is wisdom in your longing—*follow it inward.*",
  "🌬 Breathe. *You are not late. You are on divine timing.*",
  "🌌 You carry ancient light. *Let it guide your modern path.*",
  "🌺 You are the prayer your ancestors whispered. *Walk like it.*",
  "⏳ Let go of urgency. *The soul moves in spirals, not straight lines.*",
  "🪶 Your softness is not weakness—*it’s sacred resilience.*",
  "🌊 Flow with your truth today. *No mask. No pretending.*",
  "🕯 A sacred fire lives in your belly. *What are you waiting to ignite?*",
  "🧿 You are already the miracle. *Stop waiting to become.*",
  "🔔 Listen—the call isn’t out there. *It’s always been within.*"
];

const usedApiSet = new Set();

function getHigherSelfMessage(userId) {
  if (!usedApiSet.has(userId)) {
    usedApiSet.add(userId);
    const i = Math.floor(Math.random() * presetMessages.length);
    return presetMessages[i];
  } else {
    return callDeepSeekHigher();
  }
}

async function callDeepSeekHigher() {
  const apiKey = "sk-cf17088ece0a4bc985dec1464cf504e1"; // tarot-bot-key
  const prompt = `Offer a spiritual and poetic message from the user's Higher Self. Focus on empowerment, inner truth, and soul remembrance.`;

  try {
    const res = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return res.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("DeepSeek API error (higher-self):", err.message);
    return "⚠️ Your Higher Self is quiet now. Return when you are ready to hear.";
  }
}

module.exports = { getHigherSelfMessage };
