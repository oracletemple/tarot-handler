// G_soul-archetype.js - v1.0.0

/**
 * 返回一个灵魂原型与象征含义
 */
function getSoulArchetype() {
  const archetypes = [
    { name: "The Seeker", meaning: "Driven by curiosity and the need to explore your inner world." },
    { name: "The Healer", meaning: "Born to transform wounds into wisdom—for yourself and others." },
    { name: "The Mystic", meaning: "You live in the space between worlds, guided by symbols and silence." },
    { name: "The Warrior", meaning: "Strength through trials. You’re here to protect your truth." },
    { name: "The Lover", meaning: "You lead through intimacy and emotional depth." },
    { name: "The Sage", meaning: "Wisdom is your compass. You observe, absorb, and enlighten." }
  ];

  const pick = archetypes[Math.floor(Math.random() * archetypes.length)];
  return `💠 *Soul Archetype: ${pick.name}*\n\n${pick.meaning}`;
}

module.exports = { getSoulArchetype };
