// G_soul-archetype.js - v1.2.0

const { getDeepseekReply } = require("./G_deepseek");

const presetArchetypes = [
  "You are the Seeker: always drawn to the horizon, craving truth and meaning.",
  "You embody the Healer: your journey through pain makes you a light for others.",
  "You walk as the Mystic: sensing beyond the veil, decoding spiritual patterns.",
  "You are the Creator: bringing beauty and vision into the world from nothing.",
  "You carry the energy of the Warrior: resilient, focused, and brave in the face of adversity.",
  "You channel the Sage: rooted in wisdom, observing life through the lens of deeper knowing.",
  "You are the Lover: here to open hearts and hold sacred space for connection.",
  "You serve as the Alchemist: transmuting darkness into gold through inner transformation.",
  "You carry the Fool: embracing unknown paths with innocent courage and divine trust.",
  "You are the Oracle: a vessel for insight, intuition, and ancestral memory.",
  "You walk as the Rebel: challenging systems that limit the soul’s freedom.",
  "You are the Guardian: a protector of sacred truths and vulnerable spirits.",
  "You embody the Visionary: dreaming of futures that others have not yet imagined.",
  "You channel the Magician: turning ideas into manifestation with divine will.",
  "You serve as the Priestess: keeper of rituals, feminine wisdom, and lunar cycles.",
  "You are the Wild One: untamed, primal, and fiercely alive.",
  "You are the Teacher: guiding others by embodying your lessons.",
  "You walk as the Pilgrim: embracing every phase of life as sacred journey.",
  "You are the Mirror: reflecting truth, even when it's uncomfortable.",
  "You carry the Wounded Child: tender, sensitive, and a deep well of empathy.",
  "You are the Weaver: connecting past, present, and future into symbolic threads of meaning."
];

const archetypeMemory = new Map();

async function getSoulArchetype(userId) {
  if (!archetypeMemory.has(userId)) {
    const index = Math.floor(Math.random() * presetArchetypes.length);
    archetypeMemory.set(userId, true);
    return `🌀 Soul Archetype\n\n${presetArchetypes[index]}`;
  } else {
    const prompt = "Offer a symbolic and mystical soul archetype message for the user. Describe their inner role or essence in spiritual language that feels both validating and awakening.";
    const reply = await getDeepseekReply(prompt);
    return `🌀 Soul Archetype\n\n${reply}`;
  }
}

module.exports = { getSoulArchetype };
