// G_energy-reading.js - v1.2.0

const { getDeepseekReply } = require("./G_deepseek");

const presetEnergy = [
  "Your energy is in flux—like a tide pulling back to gather strength. Be still, then rise.",
  "You radiate healing vibrations. Others feel safe in your presence.",
  "Your aura hums with transformation. Let go of what no longer resonates.",
  "You are holding too much. Energy stagnates when boundaries blur. Reclaim your space.",
  "There’s a soft glow returning to your field. Trust in this gentle renewal.",
  "Your root is seeking grounding. Connect with earth, breath, and simple rituals.",
  "Your heart field pulses with readiness. It's safe to receive love again.",
  "You are energetically shedding. Let the release be sacred, not rushed.",
  "Clarity is forming in your third eye. Trust the subtle impressions you receive.",
  "Your field expands when you speak your truth. Expression is your alignment."
];

const energyMemory = new Map();

async function getEnergyReading(userId) {
  if (!energyMemory.has(userId)) {
    const index = Math.floor(Math.random() * presetEnergy.length);
    energyMemory.set(userId, true);
    return `🌀 Energy Reading\n\n${presetEnergy[index]}`;
  } else {
    const prompt = "Offer a symbolic and intuitive energy reading for the user. Reflect their current spiritual or energetic state, and provide insight or healing guidance based on what you sense.";
    const reply = await getDeepseekReply(prompt);
    return `🌀 Energy Reading\n\n${reply}`;
  }
}

module.exports = { getEnergyReading };
