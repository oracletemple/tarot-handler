// G_cosmic-alignment.js - v1.2.0

const { getDeepseekReply } = require("./G_deepseek");

const presetAlignments = [
  "Right now, the cosmos aligns for clarity—release distractions and follow the spark.",
  "You are in sync with a cosmic gateway—what you choose now echoes into destiny.",
  "The stars whisper: rest is sacred. Recharge to receive what’s next.",
  "Cosmic tides urge you inward. Stillness reveals the divine design unfolding.",
  "You are orbiting purpose. Let old timelines collapse without fear.",
  "This moment is a frequency match for your intention—act with sacred certainty.",
  "Celestial cycles are resetting—plant a new seed of self-belief.",
  "The universe holds its breath in your honor—your next move is blessed.",
  "Cosmic alignment amplifies your truth. Speak it into reality.",
  "You are synced with expansion. Let go of roles that shrink you.",
  "The cosmos echoes your courage—risk the leap, you are supported.",
  "A new energetic current rises—ride it with open heart and grounded faith.",
  "You are between eclipses of the soul—clarity comes through release.",
  "Universal forces are harmonizing your heart and path—walk in alignment.",
  "Now is a portal of potential—what intention do you dare to declare?",
  "You’re not lost—you’re being repositioned by sacred gravitational pull.",
  "The alignment is real. Trust the divine redirection unfolding.",
  "The universe rearranges for those who align with their soul’s truth.",
  "Your inner world mirrors the cosmic dance. Bring harmony within.",
  "Today’s energy is electric—amplify only what’s in resonance with your highest path.",
  "Cosmic alignment does not require effort—only permission to be who you are."
];

const cosmicMemory = new Map();

async function getCosmicAlignment(userId) {
  if (!cosmicMemory.has(userId)) {
    const index = Math.floor(Math.random() * presetAlignments.length);
    cosmicMemory.set(userId, true);
    return `🌌 Cosmic Alignment\n\n${presetAlignments[index]}`;
  } else {
    const prompt = "Provide a mystical and empowering cosmic alignment message that reflects the user's current spiritual resonance with the universe. Keep it symbolic and energetically attuned.";
    const reply = await getDeepseekReply(prompt);
    return `🌌 Cosmic Alignment\n\n${reply}`;
  }
}

module.exports = { getCosmicAlignment };
