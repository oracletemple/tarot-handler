// utils/tarot.js

const cards = [
  {
    name: "The Fool",
    upright: "New beginnings, spontaneity, freedom, innocence.",
    reversed: "Recklessness, holding back, risk without thought."
  },
  {
    name: "The Magician",
    upright: "Manifestation, skill, inspired action, resourcefulness.",
    reversed: "Manipulation, illusion, untapped potential."
  },
  {
    name: "The High Priestess",
    upright: "Intuition, mystery, inner knowing, divine feminine.",
    reversed: "Hidden agendas, disconnected from intuition."
  },
  {
    name: "The Empress",
    upright: "Abundance, creation, fertility, nurturing energy.",
    reversed: "Dependence, smothering, creative block, imbalance."
  },
  {
    name: "The Emperor",
    upright: "Stability, authority, structure, protection.",
    reversed: "Domination, rigidity, lack of discipline."
  },
  {
    name: "The Lovers",
    upright: "Love, harmony, alignment, choices from the heart.",
    reversed: "Disharmony, imbalance, conflict or indecision."
  },
  {
    name: "The Chariot",
    upright: "Determination, success, willpower, victory through focus.",
    reversed: "Loss of direction, scattered energy, delays."
  },
  {
    name: "Strength",
    upright: "Courage, inner strength, compassion, resilience.",
    reversed: "Insecurity, weakness, lack of confidence or doubt."
  },
  {
    name: "The Hermit",
    upright: "Introspection, soul-searching, inner guidance.",
    reversed: "Withdrawal, isolation, avoidance of reflection."
  },
  {
    name: "The Wheel of Fortune",
    upright: "Destiny, change, cycles, turning point, luck.",
    reversed: "Bad luck, delays, resistance to change."
  },
  {
    name: "Justice",
    upright: "Truth, fairness, law, cause and effect.",
    reversed: "Injustice, dishonesty, lack of accountability."
  },
  {
    name: "The Hanged Man",
    upright: "Pause, surrender, new perspective, letting go.",
    reversed: "Stagnation, resistance, fear of sacrifice."
  },
  {
    name: "Death",
    upright: "Transformation, endings, rebirth, letting go.",
    reversed: "Resistance to change, fear, delayed endings."
  },
  {
    name: "Temperance",
    upright: "Balance, harmony, patience, blending energies.",
    reversed: "Imbalance, excess, lack of moderation."
  },
  {
    name: "The Devil",
    upright: "Attachment, temptation, materialism, restriction.",
    reversed: "Freedom, release, breaking negative patterns."
  },
  {
    name: "The Tower",
    upright: "Sudden change, upheaval, revelation, awakening.",
    reversed: "Avoided disaster, fear of change, delayed transformation."
  },
  {
    name: "The Star",
    upright: "Hope, inspiration, serenity, renewal, divine guidance.",
    reversed: "Despair, disconnection, lack of faith."
  },
  {
    name: "The Moon",
    upright: "Illusion, intuition, dreams, subconscious.",
    reversed: "Confusion, fear, unveiling truth."
  },
  {
    name: "The Sun",
    upright: "Success, positivity, joy, vitality, clarity.",
    reversed: "Temporary depression, false impressions."
  },
  {
    name: "Judgement",
    upright: "Awakening, clarity, redemption, higher calling.",
    reversed: "Self-doubt, unwillingness to learn, stagnation."
  },
  {
    name: "The World",
    upright: "Completion, achievement, celebration, fulfillment.",
    reversed: "Delays in completion, lack of closure."
  },
];

function getRandomCard() {
  const card = cards[Math.floor(Math.random() * cards.length)];
  const reversed = Math.random() < 0.5;
  return {
    name: card.name,
    position: reversed ? "Reversed" : "Upright",
    meaning: reversed ? card.reversed : card.upright,
  };
}

function generateThreeCardReading() {
  const positions = ["Past", "Present", "Future"];
  const picked = new Set();
  const results = [];

  while (results.length < 3) {
    const card = getRandomCard();
    const key = `${card.name}-${card.position}`;
    if (!picked.has(key)) {
      picked.add(key);
      results.push(card);
    }
  }

  let message = `🔮 Your Tarot Reading (Past · Present · Future)\n\n`;
  for (let i = 0; i < 3; i++) {
    const card = results[i];
    message += `🃏 ${positions[i]} – ${card.name} (${card.position})\n${card.meaning}\n\n`;
  }

  message += `✨ Trust the path ahead. Your spirit is being gently guided.`;

  return message;
}

module.exports = { generateThreeCardReading };
