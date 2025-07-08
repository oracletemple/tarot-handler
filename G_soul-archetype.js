// G_soul-archetype.js - v1.1.0

function getSoulArchetype() {
  const archetypes = [
    { name: "The Seeker", meaning: "Endlessly curious. You walk the edge of the known, searching for what lies beyond." },
    { name: "The Healer", meaning: "You carry medicine in your wounds. You guide others through the path you’ve walked." },
    { name: "The Mystic", meaning: "You live in symbol and silence. You see the sacred in all things." },
    { name: "The Warrior", meaning: "You rise through resistance. Boundaries are your sacred sword." },
    { name: "The Lover", meaning: "You feel the world through your skin. Emotion is your compass." },
    { name: "The Sage", meaning: "You distill chaos into wisdom. You learn, teach, and illuminate." },
    { name: "The Creator", meaning: "You shape the formless into beauty. Imagination is your temple." },
    { name: "The Rebel", meaning: "You dismantle what no longer serves. You carry the fire of transformation." },
    { name: "The Innocent", meaning: "You trust without proof. You remind the world of wonder." },
    { name: "The Ruler", meaning: "You bring order from chaos. You govern your realm with vision." },
    { name: "The Alchemist", meaning: "You turn pain into power. You embody transmutation." },
    { name: "The Shapeshifter", meaning: "You adapt, blend, and mirror. Your truth lies in multiplicity." },
    { name: "The Orphan", meaning: "You’ve known abandonment—and built strength from it." },
    { name: "The Priestess", meaning: "You channel unseen wisdom. You are a threshold between worlds." },
    { name: "The Fool", meaning: "You leap into the unknown with sacred playfulness." },
    { name: "The Witness", meaning: "You observe without judgment. Your presence is your gift." }
  ];

  const pick = archetypes[Math.floor(Math.random() * archetypes.length)];
  return `💠 *Soul Archetype: ${pick.name}*\n\n${pick.meaning}`;
}

module.exports = { getSoulArchetype };
