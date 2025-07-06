const cards = [
  {
    "id": 0,
    "name": "The Fool",
    "image": "https://upload.wikimedia.org/wikipedia/en/9/90/RWS_Tarot_00_Fool.jpg",
    "meaning": "New beginnings, spontaneity, free spirit."
  },
  {
    "id": 1,
    "name": "The Magician",
    "image": "https://upload.wikimedia.org/wikipedia/en/d/de/RWS_Tarot_01_Magician.jpg",
    "meaning": "Power, skill, concentration, resourcefulness."
  },
  {
    "id": 2,
    "name": "The High Priestess",
    "image": "https://upload.wikimedia.org/wikipedia/en/8/88/RWS_Tarot_02_High_Priestess.jpg",
    "meaning": "Intuition, sacred knowledge, divine feminine."
  },
  {
    "id": 3,
    "name": "The Empress",
    "image": "https://upload.wikimedia.org/wikipedia/en/d/d2/RWS_Tarot_03_Empress.jpg",
    "meaning": "Femininity, beauty, nature, abundance."
  },
  {
    "id": 4,
    "name": "The Emperor",
    "image": "https://upload.wikimedia.org/wikipedia/en/c/c3/RWS_Tarot_04_Emperor.jpg",
    "meaning": "Authority, structure, control, fatherhood."
  },
  {
    "id": 5,
    "name": "The Hierophant",
    "image": "https://upload.wikimedia.org/wikipedia/en/8/8d/RWS_Tarot_05_Hierophant.jpg",
    "meaning": "Tradition, conformity, morality, ethics."
  },
  {
    "id": 6,
    "name": "The Lovers",
    "image": "https://upload.wikimedia.org/wikipedia/en/d/db/RWS_Tarot_06_Lovers.jpg",
    "meaning": "Love, harmony, relationships, values alignment."
  },
  {
    "id": 7,
    "name": "The Chariot",
    "image": "https://upload.wikimedia.org/wikipedia/en/3/3a/The_Chariot.jpg",
    "meaning": "Control, willpower, success, determination."
  },
  {
    "id": 8,
    "name": "Strength",
    "image": "https://upload.wikimedia.org/wikipedia/en/f/f5/RWS_Tarot_08_Strength.jpg",
    "meaning": "Courage, persuasion, influence, compassion."
  },
  {
    "id": 9,
    "name": "The Hermit",
    "image": "https://upload.wikimedia.org/wikipedia/en/4/4d/RWS_Tarot_09_Hermit.jpg",
    "meaning": "Soul-searching, introspection, inner guidance."
  },
  {
    "id": 10,
    "name": "Wheel of Fortune",
    "image": "https://upload.wikimedia.org/wikipedia/en/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
    "meaning": "Change, cycles, fate, karma."
  },
  {
    "id": 11,
    "name": "Justice",
    "image": "https://upload.wikimedia.org/wikipedia/en/e/e0/RWS_Tarot_11_Justice.jpg",
    "meaning": "Fairness, truth, law, cause and effect."
  },
  {
    "id": 12,
    "name": "The Hanged Man",
    "image": "https://upload.wikimedia.org/wikipedia/en/2/2b/RWS_Tarot_12_Hanged_Man.jpg",
    "meaning": "Pause, surrender, letting go, new perspective."
  },
  {
    "id": 13,
    "name": "Death",
    "image": "https://upload.wikimedia.org/wikipedia/en/d/d7/RWS_Tarot_13_Death.jpg",
    "meaning": "Endings, change, transformation, transition."
  },
  {
    "id": 14,
    "name": "Temperance",
    "image": "https://upload.wikimedia.org/wikipedia/en/f/f8/RWS_Tarot_14_Temperance.jpg",
    "meaning": "Balance, moderation, patience, purpose."
  },
  {
    "id": 15,
    "name": "The Devil",
    "image": "https://upload.wikimedia.org/wikipedia/en/5/55/RWS_Tarot_15_Devil.jpg",
    "meaning": "Shadow self, attachment, addiction, restriction."
  },
  {
    "id": 16,
    "name": "The Tower",
    "image": "https://upload.wikimedia.org/wikipedia/en/5/53/RWS_Tarot_16_Tower.jpg",
    "meaning": "Sudden change, upheaval, chaos, revelation."
  },
  {
    "id": 17,
    "name": "The Star",
    "image": "https://upload.wikimedia.org/wikipedia/en/d/db/RWS_Tarot_17_Star.jpg",
    "meaning": "Hope, faith, purpose, renewal, spirituality."
  },
  {
    "id": 18,
    "name": "The Moon",
    "image": "https://upload.wikimedia.org/wikipedia/en/7/7f/RWS_Tarot_18_Moon.jpg",
    "meaning": "Illusion, fear, anxiety, subconscious, intuition."
  },
  {
    "id": 19,
    "name": "The Sun",
    "image": "https://upload.wikimedia.org/wikipedia/en/1/17/RWS_Tarot_19_Sun.jpg",
    "meaning": "Positivity, fun, warmth, success, vitality."
  },
  {
    "id": 20,
    "name": "Judgement",
    "image": "https://upload.wikimedia.org/wikipedia/en/d/dd/RWS_Tarot_20_Judgement.jpg",
    "meaning": "Judgement, rebirth, inner calling, absolution."
  },
  {
    "id": 21,
    "name": "The World",
    "image": "https://upload.wikimedia.org/wikipedia/en/f/ff/RWS_Tarot_21_World.jpg",
    "meaning": "Completion, integration, accomplishment, travel."
  },
  {
    "id": 22,
    "name": "Ace of Wands",
    "meaning": "Placeholder meaning for Ace of Wands.",
    "image": null
  },
  {
    "id": 23,
    "name": "Two of Wands",
    "meaning": "Placeholder meaning for Two of Wands.",
    "image": null
  },
  {
    "id": 24,
    "name": "Three of Wands",
    "meaning": "Placeholder meaning for Three of Wands.",
    "image": null
  },
  {
    "id": 25,
    "name": "Four of Wands",
    "meaning": "Placeholder meaning for Four of Wands.",
    "image": null
  },
  {
    "id": 26,
    "name": "Five of Wands",
    "meaning": "Placeholder meaning for Five of Wands.",
    "image": null
  },
  {
    "id": 27,
    "name": "Six of Wands",
    "meaning": "Placeholder meaning for Six of Wands.",
    "image": null
  },
  {
    "id": 28,
    "name": "Seven of Wands",
    "meaning": "Placeholder meaning for Seven of Wands.",
    "image": null
  },
  {
    "id": 29,
    "name": "Eight of Wands",
    "meaning": "Placeholder meaning for Eight of Wands.",
    "image": null
  },
  {
    "id": 30,
    "name": "Nine of Wands",
    "meaning": "Placeholder meaning for Nine of Wands.",
    "image": null
  },
  {
    "id": 31,
    "name": "Ten of Wands",
    "meaning": "Placeholder meaning for Ten of Wands.",
    "image": null
  },
  {
    "id": 32,
    "name": "Page of Wands",
    "meaning": "Placeholder meaning for Page of Wands.",
    "image": null
  },
  {
    "id": 33,
    "name": "Knight of Wands",
    "meaning": "Placeholder meaning for Knight of Wands.",
    "image": null
  },
  {
    "id": 34,
    "name": "Queen of Wands",
    "meaning": "Placeholder meaning for Queen of Wands.",
    "image": null
  },
  {
    "id": 35,
    "name": "King of Wands",
    "meaning": "Placeholder meaning for King of Wands.",
    "image": null
  },
  {
    "id": 36,
    "name": "Ace of Cups",
    "meaning": "Placeholder meaning for Ace of Cups.",
    "image": null
  },
  {
    "id": 37,
    "name": "Two of Cups",
    "meaning": "Placeholder meaning for Two of Cups.",
    "image": null
  },
  {
    "id": 38,
    "name": "Three of Cups",
    "meaning": "Placeholder meaning for Three of Cups.",
    "image": null
  },
  {
    "id": 39,
    "name": "Four of Cups",
    "meaning": "Placeholder meaning for Four of Cups.",
    "image": null
  },
  {
    "id": 40,
    "name": "Five of Cups",
    "meaning": "Placeholder meaning for Five of Cups.",
    "image": null
  },
  {
    "id": 41,
    "name": "Six of Cups",
    "meaning": "Placeholder meaning for Six of Cups.",
    "image": null
  },
  {
    "id": 42,
    "name": "Seven of Cups",
    "meaning": "Placeholder meaning for Seven of Cups.",
    "image": null
  },
  {
    "id": 43,
    "name": "Eight of Cups",
    "meaning": "Placeholder meaning for Eight of Cups.",
    "image": null
  },
  {
    "id": 44,
    "name": "Nine of Cups",
    "meaning": "Placeholder meaning for Nine of Cups.",
    "image": null
  },
  {
    "id": 45,
    "name": "Ten of Cups",
    "meaning": "Placeholder meaning for Ten of Cups.",
    "image": null
  },
  {
    "id": 46,
    "name": "Page of Cups",
    "meaning": "Placeholder meaning for Page of Cups.",
    "image": null
  },
  {
    "id": 47,
    "name": "Knight of Cups",
    "meaning": "Placeholder meaning for Knight of Cups.",
    "image": null
  },
  {
    "id": 48,
    "name": "Queen of Cups",
    "meaning": "Placeholder meaning for Queen of Cups.",
    "image": null
  },
  {
    "id": 49,
    "name": "King of Cups",
    "meaning": "Placeholder meaning for King of Cups.",
    "image": null
  },
  {
    "id": 50,
    "name": "Ace of Swords",
    "meaning": "Placeholder meaning for Ace of Swords.",
    "image": null
  },
  {
    "id": 51,
    "name": "Two of Swords",
    "meaning": "Placeholder meaning for Two of Swords.",
    "image": null
  },
  {
    "id": 52,
    "name": "Three of Swords",
    "meaning": "Placeholder meaning for Three of Swords.",
    "image": null
  },
  {
    "id": 53,
    "name": "Four of Swords",
    "meaning": "Placeholder meaning for Four of Swords.",
    "image": null
  },
  {
    "id": 54,
    "name": "Five of Swords",
    "meaning": "Placeholder meaning for Five of Swords.",
    "image": null
  },
  {
    "id": 55,
    "name": "Six of Swords",
    "meaning": "Placeholder meaning for Six of Swords.",
    "image": null
  },
  {
    "id": 56,
    "name": "Seven of Swords",
    "meaning": "Placeholder meaning for Seven of Swords.",
    "image": null
  },
  {
    "id": 57,
    "name": "Eight of Swords",
    "meaning": "Placeholder meaning for Eight of Swords.",
    "image": null
  },
  {
    "id": 58,
    "name": "Nine of Swords",
    "meaning": "Placeholder meaning for Nine of Swords.",
    "image": null
  },
  {
    "id": 59,
    "name": "Ten of Swords",
    "meaning": "Placeholder meaning for Ten of Swords.",
    "image": null
  },
  {
    "id": 60,
    "name": "Page of Swords",
    "meaning": "Placeholder meaning for Page of Swords.",
    "image": null
  },
  {
    "id": 61,
    "name": "Knight of Swords",
    "meaning": "Placeholder meaning for Knight of Swords.",
    "image": null
  },
  {
    "id": 62,
    "name": "Queen of Swords",
    "meaning": "Placeholder meaning for Queen of Swords.",
    "image": null
  },
  {
    "id": 63,
    "name": "King of Swords",
    "meaning": "Placeholder meaning for King of Swords.",
    "image": null
  },
  {
    "id": 64,
    "name": "Ace of Pentacles",
    "meaning": "Placeholder meaning for Ace of Pentacles.",
    "image": null
  },
  {
    "id": 65,
    "name": "Two of Pentacles",
    "meaning": "Placeholder meaning for Two of Pentacles.",
    "image": null
  },
  {
    "id": 66,
    "name": "Three of Pentacles",
    "meaning": "Placeholder meaning for Three of Pentacles.",
    "image": null
  },
  {
    "id": 67,
    "name": "Four of Pentacles",
    "meaning": "Placeholder meaning for Four of Pentacles.",
    "image": null
  },
  {
    "id": 68,
    "name": "Five of Pentacles",
    "meaning": "Placeholder meaning for Five of Pentacles.",
    "image": null
  },
  {
    "id": 69,
    "name": "Six of Pentacles",
    "meaning": "Placeholder meaning for Six of Pentacles.",
    "image": null
  },
  {
    "id": 70,
    "name": "Seven of Pentacles",
    "meaning": "Placeholder meaning for Seven of Pentacles.",
    "image": null
  },
  {
    "id": 71,
    "name": "Eight of Pentacles",
    "meaning": "Placeholder meaning for Eight of Pentacles.",
    "image": null
  },
  {
    "id": 72,
    "name": "Nine of Pentacles",
    "meaning": "Placeholder meaning for Nine of Pentacles.",
    "image": null
  },
  {
    "id": 73,
    "name": "Ten of Pentacles",
    "meaning": "Placeholder meaning for Ten of Pentacles.",
    "image": null
  },
  {
    "id": 74,
    "name": "Page of Pentacles",
    "meaning": "Placeholder meaning for Page of Pentacles.",
    "image": null
  },
  {
    "id": 75,
    "name": "Knight of Pentacles",
    "meaning": "Placeholder meaning for Knight of Pentacles.",
    "image": null
  },
  {
    "id": 76,
    "name": "Queen of Pentacles",
    "meaning": "Placeholder meaning for Queen of Pentacles.",
    "image": null
  },
  {
    "id": 77,
    "name": "King of Pentacles",
    "meaning": "Placeholder meaning for King of Pentacles.",
    "image": null
  }
];

module.exports = cards;
