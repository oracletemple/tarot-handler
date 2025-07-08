// G_cosmic-alignment.js - v1.1.0
const axios = require("axios");

const presetMessages = [
  "🌌 You are a thread in the great cosmic weave. Today, your thoughts ripple into the stars.",
  "🌠 Celestial forces align in your favor. Move with quiet confidence and let the universe co-create.",
  "🪐 Planetary rhythms echo within you. Your heartbeat follows the rhythm of divine intelligence.",
  "🌟 A galactic portal opens. Step through with faith and curiosity—something ancient awaits.",
  "🌙 The moon whispers your name. Honor your inner tides and trust their wisdom.",
  "🌞 The sun's rays carry encoded blessings. Let them awaken forgotten dreams.",
  "✨ You are attuned to the sacred geometry of existence. Each step you take is a sacred design.",
  "🔭 Stars gather behind your intentions. Make a wish—not with hope, but with certainty.",
  "🌌 Constellations echo your soul's blueprint. Remember why you came.",
  "🌬 The breath of the cosmos is within you. Inhale alignment, exhale resistance.",
  "🌟 Today, you are not separate. Every vibration within you mirrors the cosmos above.",
  "🌀 Time bends in your favor. Divine timing is not late—it’s preparing something better.",
  "💫 The cosmos hums with your name. You are not forgotten—you are unfolding.",
  "🌔 Lunar alignments open hidden doorways. Seek the space between the seen and unseen.",
  "🌈 Solar flares of inspiration rise through your spine. Act on the nudges you feel.",
  "☄️ You are a comet in someone's sky. Your light travels farther than you know.",
  "🌍 Earth grounds you, the stars guide you. Stay rooted while reaching.",
  "🪞 Look to the night sky for reflection. Your soul has always been written there.",
  "🛸 Cosmic messages come in silence. Listen beyond the noise.",
  "🌌 Galactic energies are activating your next evolution. Trust what feels new.",
  "🔮 You are exactly where the universe needs you to be. No step is wasted."
];

const usedApiSet = new Set();

function getCosmicAlignment(userId) {
  if (!usedApiSet.has(userId)) {
    usedApiSet.add(userId);
    const random = Math.floor(Math.random() * presetMessages.length);
    return presetMessages[random];
  } else {
    return callDeepSeekCosmic();
  }
}

async function callDeepSeekCosmic() {
  const apiKey = "sk-cf17088ece0a4bc985dec1464cf504e1"; // tarot-bot-key
  const prompt = `Offer a poetic spiritual reflection about the user's cosmic alignment today. Mention stars, divine timing, galactic guidance, and soul purpose.`;

  try {
    const response = await axios.post(
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

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("DeepSeek API error (cosmic):", err.message);
    return "⚠️ The stars are silent for now. Please try again soon.";
  }
}

module.exports = { getCosmicAlignment };
