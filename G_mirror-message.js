// G_mirror-message.js - v1.1.0
const axios = require("axios");

const presetMirrorMessages = [
  "🪞 In your reflection, the courage you’ve doubted shines like polished gold. Own it.",
  "🪞 The mirror shows not flaws, but the journey—every scar is a step forward.",
  "🪞 What you see is not all you are. Look deeper. You are stardust and soulfire.",
  "🪞 The voice that criticizes is not yours. Return to the truth of your worth.",
  "🪞 Behind every shadow lies a lesson. The mirror offers you a choice: blame or bloom.",
  "🪞 Your reflection is not seeking perfection—it craves presence and acceptance.",
  "🪞 Let the mirror speak kindness today. See the healer, the artist, the mystic within.",
  "🪞 Through the mirror, your inner child waves. Will you smile back?",
  "🪞 Today’s reflection carries a whisper: *You have always been enough.*",
  "🪞 When you dare to face yourself fully, your light expands without apology.",
  "🪞 The mirror does not lie, but it can be blinded by shame. Cleanse it with compassion.",
  "🪞 You are not the broken pieces you see—you are the hands that gather them in love.",
  "🪞 Reflections are invitations. What will you say to the soul gazing back?",
  "🪞 Your true self is not hidden, only waiting to be greeted without judgment.",
  "🪞 The mirror reveals both the mask and the essence. It asks: which one will you choose today?",
  "🪞 In your eyes glimmers the strength of your ancestors. Let their courage move you.",
  "🪞 What you hide from the world, the mirror still embraces. That is your power.",
  "🪞 See the reflection not as a critique, but as a canvas—each day you repaint.",
  "🪞 The mirror's silence speaks volumes. Are you ready to listen to your truth?",
  "🪞 Behind tired eyes is a soul fiercely alive. Reclaim your fire.",
  "🪞 You’ve stared into the mirror seeking flaws—today, seek the divine."
];

const usedApiSet = new Set();

function getMirrorMessage(userId) {
  if (!usedApiSet.has(userId)) {
    usedApiSet.add(userId);
    const random = Math.floor(Math.random() * presetMirrorMessages.length);
    return presetMirrorMessages[random];
  } else {
    return callDeepSeekMirror();
  }
}

// ✅ DeepSeek 调用逻辑：灵性镜像洞察
async function callDeepSeekMirror() {
  const apiKey = "sk-cf17088ece0a4bc985dec1464cf504e1";
  const prompt = `Offer a symbolic, poetic, and introspective spiritual message as if the user is gazing into a sacred mirror. Reflect their inner journey and soul truth, with gentle yet deep insight.`;

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

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("DeepSeek API error (mirror):", err.message);
    return "⚠️ The mirror is clouded right now. Try again when the reflection clears.";
  }
}

module.exports = { getMirrorMessage };
