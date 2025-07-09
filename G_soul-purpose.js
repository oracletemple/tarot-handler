// G_soul-purpose.js - v1.2.0

const { getDeepseekReply } = require("./G_deepseek");

const presetPurposes = [
  "You are here to be a bridge—between worlds, between people, between soul and society.",
  "Your soul chose to awaken others through truth, even when it shakes comfort.",
  "You are a light-carrier. Simply by being, you raise the frequency of those around you.",
  "Your path is one of integration—shadow and light, logic and intuition, self and collective.",
  "You are a storyteller. Your voice carries the medicine of meaning.",
  "You were born to remember ancient wisdom and share it in modern ways.",
  "Your mission is love in action—embodied, imperfect, and fiercely kind.",
  "You are here to shift paradigms—one choice, one breath, one awakening at a time.",
  "You are not lost. You are encoded with direction. Listen inward.",
  "Your presence alone is part of the design. Your being is your purpose."
];

const purposeMemory = new Map();

async function getSoulPurpose(userId) {
  if (!purposeMemory.has(userId)) {
    const index = Math.floor(Math.random() * presetPurposes.length);
    purposeMemory.set(userId, true);
    return `🔭 Soul Purpose\n\n${presetPurposes[index]}`;
  } else {
    const prompt = "You are a wise spiritual guide. Provide a symbolic, empowering message about the user's soul purpose. Make it feel sacred, profound, and personally meaningful.";
    const reply = await getDeepseekReply(prompt);
    return `🔭 Soul Purpose\n\n${reply}`;
  }
}

module.exports = { getSoulPurpose };
