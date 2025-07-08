// G_tarot-summary.js - v1.1.0
const axios = require("axios");

const presetSummaries = [
  "🧭 *Guided Reflection*: Your past holds lessons, your present holds power, and your future holds promise. Trust the arc of your journey.",
  "🌌 *Spiritual Alignment*: Each card reveals a layer—what once was, what is now, and what is becoming. You are on a sacred path.",
  "🌀 *Energy Flow*: The rhythm of your soul is unfolding perfectly. Past, present, and future are all allies in your growth.",
  "🔥 *Transformation Insight*: You’ve walked through fire, stood in stillness, and now face the winds of change. Own your evolution.",
  "🌿 *Nature’s Rhythm*: Like seasons, your story has patterns. Let go, grow, and prepare for the next bloom.",
  "💫 *Cosmic Summary*: The cards align to tell a greater tale—one of resilience, purpose, and unfolding destiny.",
  "🌙 *Mystic Insight*: You are the bridge between what has passed and what is to come. Walk it with courage.",
  "🔮 *Soul Compass*: The cards point inward before they point forward. Listen deeply to their invitation.",
  "🧘 *Sacred Mirror*: What you’ve drawn reflects your soul’s quiet knowing. You already hold the answers.",
  "🌈 *Harmonic Weave*: Past, present, and future are threads in a divine tapestry. See the beauty of your becoming.",
  "🌞 *Illumination Path*: Even shadows cast light on where you’re meant to grow. Nothing is wasted.",
  "🪶 *Wisdom Whisper*: The journey is not linear. Let your heart be the storyteller.",
  "🌊 *Flow State*: What you resist may hold your next gift. Flow through time with presence.",
  "⚖️ *Balance Point*: Your reading reflects a quest for harmony. Seek the center within.",
  "🪐 *Universal Timing*: All unfolds as it should. Your life is synced with a larger divine rhythm.",
  "🌺 *Soul Garden*: Your growth is sacred. Every card a seed, every moment fertile.",
  "🕯 *Light of Insight*: The story revealed is a candle in the dark. Follow where it flickers.",
  "🐚 *Inner Echoes*: Listen to what the cards repeat within you—they echo truths you’ve known all along.",
  "🧲 *Magnetic Path*: What you’re attracting now is shaped by what you’ve healed. Continue onward.",
  "🫧 *Clarity Rising*: The fog is lifting. Your next chapter is calling you gently forward.",
  "🌠 *Destiny Glimpse*: This moment is a glimpse through the veil. Carry it like a talisman."
];

const usedApiSet = new Set();

function getTarotSummary(userId) {
  if (!usedApiSet.has(userId)) {
    usedApiSet.add(userId);
    const i = Math.floor(Math.random() * presetSummaries.length);
    return presetSummaries[i];
  } else {
    return callDeepSeekTarotSummary();
  }
}

async function callDeepSeekTarotSummary() {
  const apiKey = "sk-cf17088ece0a4bc985dec1464cf504e1";
  const prompt = `Offer a mystical, poetic summary that reflects on the user's past, present, and future as seen through three Tarot cards. Emphasize spiritual growth and symbolic insight.`;

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.95,
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
    console.error("DeepSeek API error (tarot-summary):", err.message);
    return "⚠️ The insight is veiled right now. Please try again later.";
  }
}

module.exports = { getTarotSummary };
