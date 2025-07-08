// G_soul-archetype.js - v1.1.0
const axios = require("axios");

const presetArchetypes = [
  "🦅 *The Visionary*\nYou see beyond the surface and dream in symbols. Your path is to inspire others with insight.",
  "🛡 *The Protector*\nYour strength creates safety. You are called to defend what is sacred in yourself and others.",
  "🧙 *The Sage*\nWisdom flows through you. You learn, integrate, and illuminate the path for others.",
  "🔥 *The Alchemist*\nYou transform shadow into gold. Challenges are your crucibles of power.",
  "🌹 *The Mystic*\nYou hear whispers from beyond. Stillness is your sanctuary and portal to truth.",
  "🎭 *The Shapeshifter*\nYou adapt, blend, and flow. Your gift is reinvention—but stay rooted in your truth.",
  "🌊 *The Healer*\nYou bring restoration through presence. Others feel lighter in your care.",
  "🪞 *The Mirror*\nYou reflect hidden truths. Encounters with you often spark awakening.",
  "🦋 *The Rebirth*\nYou embody cycles of death and renewal. Transformation is your sacred rhythm.",
  "📜 *The Storyteller*\nYou carry ancestral echoes. Through narrative, you bring meaning to chaos.",
  "🦉 *The Oracle*\nYou perceive patterns and signs. Trust what you know beyond logic.",
  "🌞 *The Illuminator*\nYou radiate joy and reveal clarity. Your presence dispels confusion.",
  "🕯 *The Keeper*\nYou preserve what is vanishing. You are a living archive of memory and meaning.",
  "🔮 *The Dreamer*\nVisions visit you easily. Your dreams may hold the seeds of prophecy.",
  "🛶 *The Seeker*\nYou are always questing, curious, evolving. The path is your home.",
  "🪶 *The Messenger*\nWords find you when others fall silent. You speak truths others fear to name.",
  "🦢 *The Gracebearer*\nYour presence soothes pain and uplifts spirits. You lead with quiet elegance.",
  "🗝 *The Gatekeeper*\nYou sense thresholds—moments of choice, doors of destiny. You hold space at the edge.",
  "🐍 *The Initiate*\nYou are in a sacred process of becoming. Trust what’s unformed within you.",
  "🌀 *The Weaver*\nYou connect the threads of life. Patterns emerge through your intuition.",
  "🌿 *The Wild One*\nYou are untamed and true. Nature is your mirror and your guide."
];

const usedApiSet = new Set();

function getSoulArchetype(userId) {
  if (!usedApiSet.has(userId)) {
    usedApiSet.add(userId);
    const idx = Math.floor(Math.random() * presetArchetypes.length);
    return presetArchetypes[idx];
  } else {
    return callDeepSeekArchetype();
  }
}

async function callDeepSeekArchetype() {
  const apiKey = "sk-cf17088ece0a4bc985dec1464cf504e1"; // tarot-bot-key
  const prompt = `Offer a mystical and symbolic soul archetype reading. Describe the user as an archetypal energy using poetic, mythic, or elemental language.`;

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
    console.error("DeepSeek API error (archetype):", err.message);
    return "⚠️ The archetypes are shifting silently. Please try again later.";
  }
}

module.exports = { getSoulArchetype };
