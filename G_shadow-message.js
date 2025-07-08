// G_shadow-message.js - v1.1.0
const axios = require("axios");

const presetShadowMessages = [
  "🌑 You may be resisting change. Ask yourself what part of you fears transformation.",
  "🪞 A pattern repeats. What story are you still trying to rewrite from the past?",
  "🕳 There is a wound you keep hidden. Healing begins by naming it.",
  "🔥 Anger bubbles beneath. What boundary has been crossed within you?",
  "🌫 Confusion can be a mask for truth. What are you avoiding seeing clearly?",
  "🪦 Old guilt lingers in your energetic field. Release the punishment you think you deserve.",
  "⏳ You rush to avoid discomfort. Sit still and let your shadow speak.",
  "🔗 An attachment holds you captive. Who or what still defines your worth?",
  "🦂 Your defenses are sharp—are they protecting you, or isolating you?",
  "🌒 A part of you feels unloved. Offer that part compassion, not criticism.",
  "🕯 You fear your own power. Why does the idea of being fully seen scare you?",
  "🧤 You’re performing a role. What does your true self long to express?",
  "🚪 A door keeps closing. Is it because you haven’t grieved what’s behind it?",
  "🌪 You are caught in overthinking. Step into the body. Let feeling lead.",
  "🧱 Control feels safer than trust. Explore what happens when you let go.",
  "🔍 The shadow isn’t here to hurt you—it longs to be integrated.",
  "⚖️ Are you judging others for traits you secretly deny in yourself?",
  "🎭 You fear being rejected. What part of you still rejects yourself first?",
  "🪶 Light and shadow are both sacred. Honor your wholeness today.",
  "🌀 Your shadow has messages, not threats. Listen closely."
];

const usedApiSet = new Set();

function getShadowMessage(userId) {
  if (!usedApiSet.has(userId)) {
    usedApiSet.add(userId);
    const random = Math.floor(Math.random() * presetShadowMessages.length);
    return presetShadowMessages[random];
  } else {
    return callDeepSeekShadow();
  }
}

async function callDeepSeekShadow() {
  const apiKey = "sk-cf17088ece0a4bc985dec1464cf504e1";
  const prompt = `Offer a symbolic, spiritual message that reflects the user's inner shadow, repressed feelings, or hidden emotional patterns. Use introspective and mystical tone.`;

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.85,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("DeepSeek API error (shadow):", err.message);
    return "⚠️ The shadow remains silent for now. Try again soon.";
  }
}

module.exports = { getShadowMessage };
