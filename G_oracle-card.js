// G_oracle-card.js - v1.2.0

const { getDeepseekReply } = require("./G_deepseek");

const presetOracles = [
  "🪄 Oracle: 'The path may twist, but it always leads you home. Trust the detours.'",
  "🪄 Oracle: 'Speak your truth, even if your voice shakes. Your honesty creates ripples.'",
  "🪄 Oracle: 'Release control. The divine plan is unfolding in unseen perfection.'",
  "🪄 Oracle: 'A door is closing, but a portal is opening. Step through with courage.'",
  "🪄 Oracle: 'You are not behind. You are right on time for your soul’s unfolding.'",
  "🪄 Oracle: 'The storm clears the path. Let the chaos create new clarity.'",
  "🪄 Oracle: 'Your dreams are sacred blueprints—take one small step today.'",
  "🪄 Oracle: 'Rest is a revolution. Let your being lead, not your doing.'",
  "🪄 Oracle: 'Synchronicity is a language—listen with your soul, not your mind.'",
  "🪄 Oracle: 'You are not here to shrink. Expansion is your birthright.'",
  "🪄 Oracle: 'Let love be your legacy. Every act of kindness echoes in eternity.'",
  "🪄 Oracle: 'This is not an ending—it’s a sacred turning point.'",
  "🪄 Oracle: 'You were never lost. You were being recalibrated by the divine.'",
  "🪄 Oracle: 'Let go of who you were told to be. Reclaim your sacred self.'",
  "🪄 Oracle: 'The unknown is not empty—it’s fertile with magic and possibility.'",
  "🪄 Oracle: 'Do not fear your depth. That’s where your power lives.'",
  "🪄 Oracle: 'You are your ancestor’s answered prayer. Walk with reverence.'",
  "🪄 Oracle: 'Say yes to the invitation your soul has been whispering about.'",
  "🪄 Oracle: 'Even in stillness, you are moving. Energy always flows before form.'",
  "🪄 Oracle: 'Your spirit team surrounds you. Ask, and you shall be supported.'",
  "🪄 Oracle: 'This moment is not random. It is sacredly aligned for your awakening.'"
];

const oracleMemory = new Map();

async function getOracleCard(userId) {
  if (!oracleMemory.has(userId)) {
    const index = Math.floor(Math.random() * presetOracles.length);
    oracleMemory.set(userId, true);
    return presetOracles[index];
  } else {
    const prompt = "You are an ancient oracle spirit. Offer a symbolic, mystical message to guide the user's soul at this moment of their spiritual journey. Use poetic and divine language.";
    const reply = await getDeepseekReply(prompt);
    return `🪄 Oracle Message\n\n${reply}`;
  }
}

module.exports = { 
  getOracleCard,
  getPremiumOracle: getOracleCard };
