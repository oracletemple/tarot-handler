// card-data.js - v1.0.0
// 78 Tarot cards (Rider-Waite deck) - Placeholder version

module.exports = [
  {
    name: "The Fool",
    meaning: "This card signifies new beginnings, adventures, and innocence.",
    image: "https://upload.wikimedia.org/wikipedia/en/9/90/RWS_Tarot_00_Fool.jpg"
  },
  {
    name: "The Magician",
    meaning: "This card represents manifestation, power, and inspired action.",
    image: "https://upload.wikimedia.org/wikipedia/en/d/de/RWS_Tarot_01_Magician.jpg"
  },
  {
    name: "The High Priestess",
    meaning: "This card symbolizes intuition, secrets, and divine feminine.",
    image: "https://upload.wikimedia.org/wikipedia/en/8/88/RWS_Tarot_02_High_Priestess.jpg"
  },
  {
    name: "The Empress",
    meaning: "This card suggests abundance, fertility, and nurturing.",
    image: "https://upload.wikimedia.org/wikipedia/en/d/d2/RWS_Tarot_03_Empress.jpg"
  },
  {
    name: "The Emperor",
    meaning: "This card represents authority, structure, and stability.",
    image: "https://upload.wikimedia.org/wikipedia/en/c/c3/RWS_Tarot_04_Emperor.jpg"
  },
  {
    name: "The Hierophant",
    meaning: "This card signifies tradition, conformity, and spiritual wisdom.",
    image: "https://upload.wikimedia.org/wikipedia/en/8/8d/RWS_Tarot_05_Hierophant.jpg"
  },
  {
    name: "The Lovers",
    meaning: "This card indicates love, harmony, and relationships.",
    image: "https://upload.wikimedia.org/wikipedia/en/d/db/RWS_Tarot_06_Lovers.jpg"
  },
  {
    name: "The Chariot",
    meaning: "This card suggests control, determination, and victory.",
    image: "https://upload.wikimedia.org/wikipedia/en/3/3a/The_Chariot.jpg"
  },
  {
    name: "Strength",
    meaning: "This card symbolizes courage, patience, and inner strength.",
    image: "https://upload.wikimedia.org/wikipedia/en/f/f5/RWS_Tarot_08_Strength.jpg"
  },
  {
    name: "The Hermit",
    meaning: "This card indicates introspection, solitude, and inner guidance.",
    image: "https://upload.wikimedia.org/wikipedia/en/4/4d/RWS_Tarot_09_Hermit.jpg"
  },
  {
    name: "Wheel of Fortune",
    meaning: "This card represents fate, cycles, and turning points.",
    image: "https://upload.wikimedia.org/wikipedia/en/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg"
  },
  {
    name: "Justice",
    meaning: "This card symbolizes fairness, truth, and law.",
    image: "https://upload.wikimedia.org/wikipedia/en/e/e0/RWS_Tarot_11_Justice.jpg"
  },
  {
    name: "The Hanged Man",
    meaning: "This card suggests sacrifice, release, and new perspectives.",
    image: "https://upload.wikimedia.org/wikipedia/en/2/2b/RWS_Tarot_12_Hanged_Man.jpg"
  },
  {
    name: "Death",
    meaning: "This card signifies transformation, endings, and rebirth.",
    image: "https://upload.wikimedia.org/wikipedia/en/d/d7/RWS_Tarot_13_Death.jpg"
  },
  {
    name: "Temperance",
    meaning: "This card indicates balance, moderation, and healing.",
    image: "https://upload.wikimedia.org/wikipedia/en/f/f8/RWS_Tarot_14_Temperance.jpg"
  },
  {
    name: "The Devil",
    meaning: "This card represents addiction, materialism, and shadow self.",
    image: "https://upload.wikimedia.org/wikipedia/en/5/55/RWS_Tarot_15_Devil.jpg"
  },
  {
    name: "The Tower",
    meaning: "This card symbolizes upheaval, sudden change, and awakening.",
    image: "https://upload.wikimedia.org/wikipedia/en/5/53/RWS_Tarot_16_Tower.jpg"
  },
  {
    name: "The Star",
    meaning: "This card suggests hope, inspiration, and renewal.",
    image: "https://upload.wikimedia.org/wikipedia/en/d/db/RWS_Tarot_17_Star.jpg"
  },
  {
    name: "The Moon",
    meaning: "This card represents illusion, intuition, and dreams.",
    image: "https://upload.wikimedia.org/wikipedia/en/7/7f/RWS_Tarot_18_Moon.jpg"
  },
  {
    name: "The Sun",
    meaning: "This card indicates joy, success, and vitality.",
    image: "https://upload.wikimedia.org/wikipedia/en/1/17/RWS_Tarot_19_Sun.jpg"
  },
  {
    name: "Judgement",
    meaning: "This card symbolizes reflection, reckoning, and inner calling.",
    image: "https://upload.wikimedia.org/wikipedia/en/d/dd/RWS_Tarot_20_Judgement.jpg"
  },
  {
    name: "The World",
    meaning: "This card represents completion, achievement, and wholeness.",
    image: "https://upload.wikimedia.org/wikipedia/en/f/ff/RWS_Tarot_21_World.jpg"
  },
  // The following are Minor Arcana placeholders
  ...Array.from({ length: 56 }, (_, i) => ({
    name: `Minor Arcana ${i + 1}`,
    meaning: "This is a placeholder meaning for the Minor Arcana card.",
    image: null
  }))
];
