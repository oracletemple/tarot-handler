const cardData = [
  {
    "name": "The Fool",
    "meaning": "New beginnings, optimism, trust in the universe.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/00/RWS_Tarot_The_Fool.jpg/400px-RWS_Tarot_The_Fool.jpg"
  },
  {
    "name": "The Magician",
    "meaning": "Manifestation, resourcefulness, power, inspired action.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/01/RWS_Tarot_The_Magician.jpg/400px-RWS_Tarot_The_Magician.jpg"
  },
  {
    "name": "The High Priestess",
    "meaning": "Intuition, sacred knowledge, divine feminine, the subconscious mind.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/02/RWS_Tarot_The_High_Priestess.jpg/400px-RWS_Tarot_The_High_Priestess.jpg"
  },
  {
    "name": "The Empress",
    "meaning": "Femininity, beauty, nature, nurturing, abundance.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/03/RWS_Tarot_The_Empress.jpg/400px-RWS_Tarot_The_Empress.jpg"
  },
  {
    "name": "The Emperor",
    "meaning": "Authority, structure, control, fatherhood.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/04/RWS_Tarot_The_Emperor.jpg/400px-RWS_Tarot_The_Emperor.jpg"
  },
  {
    "name": "The Hierophant",
    "meaning": "Spiritual wisdom, religious beliefs, conformity, tradition.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/05/RWS_Tarot_The_Hierophant.jpg/400px-RWS_Tarot_The_Hierophant.jpg"
  },
  {
    "name": "The Lovers",
    "meaning": "Love, harmony, relationships, choices, alignment.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/06/RWS_Tarot_The_Lovers.jpg/400px-RWS_Tarot_The_Lovers.jpg"
  },
  {
    "name": "The Chariot",
    "meaning": "Direction, control, willpower, determination, success.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/07/RWS_Tarot_The_Chariot.jpg/400px-RWS_Tarot_The_Chariot.jpg"
  },
  {
    "name": "Strength",
    "meaning": "Courage, persuasion, influence, compassion.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/08/RWS_Tarot_Strength.jpg/400px-RWS_Tarot_Strength.jpg"
  },
  {
    "name": "The Hermit",
    "meaning": "Soul-searching, introspection, inner guidance, solitude.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/09/RWS_Tarot_The_Hermit.jpg/400px-RWS_Tarot_The_Hermit.jpg"
  },
  {
    "name": "Wheel of Fortune",
    "meaning": "Change, cycles, fate, turning points.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/10/RWS_Tarot_Wheel_of_Fortune.jpg/400px-RWS_Tarot_Wheel_of_Fortune.jpg"
  },
  {
    "name": "Justice",
    "meaning": "Fairness, truth, law, cause and effect.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/11/RWS_Tarot_Justice.jpg/400px-RWS_Tarot_Justice.jpg"
  },
  {
    "name": "The Hanged Man",
    "meaning": "Pause, surrender, letting go, new perspective.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/12/RWS_Tarot_The_Hanged_Man.jpg/400px-RWS_Tarot_The_Hanged_Man.jpg"
  },
  {
    "name": "Death",
    "meaning": "Endings, transformation, transition, letting go.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/13/RWS_Tarot_Death.jpg/400px-RWS_Tarot_Death.jpg"
  },
  {
    "name": "Temperance",
    "meaning": "Balance, moderation, patience, purpose.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/14/RWS_Tarot_Temperance.jpg/400px-RWS_Tarot_Temperance.jpg"
  },
  {
    "name": "The Devil",
    "meaning": "Addiction, materialism, playfulness, restriction.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/15/RWS_Tarot_The_Devil.jpg/400px-RWS_Tarot_The_Devil.jpg"
  },
  {
    "name": "The Tower",
    "meaning": "Sudden change, upheaval, chaos, revelation, awakening.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/16/RWS_Tarot_The_Tower.jpg/400px-RWS_Tarot_The_Tower.jpg"
  },
  {
    "name": "The Star",
    "meaning": "Hope, faith, renewal, spirituality.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/17/RWS_Tarot_The_Star.jpg/400px-RWS_Tarot_The_Star.jpg"
  },
  {
    "name": "The Moon",
    "meaning": "Illusion, intuition, dreams, subconscious.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/18/RWS_Tarot_The_Moon.jpg/400px-RWS_Tarot_The_Moon.jpg"
  },
  {
    "name": "The Sun",
    "meaning": "Positivity, fun, warmth, success, vitality.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/19/RWS_Tarot_The_Sun.jpg/400px-RWS_Tarot_The_Sun.jpg"
  },
  {
    "name": "Judgement",
    "meaning": "Reflection, reckoning, awakening, inner calling.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/20/RWS_Tarot_Judgement.jpg/400px-RWS_Tarot_Judgement.jpg"
  },
  {
    "name": "The World",
    "meaning": "Completion, celebration, accomplishment, travel.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/21/RWS_Tarot_The_World.jpg/400px-RWS_Tarot_The_World.jpg"
  },
  {
    "name": "Ace of Wands",
    "meaning": "Inspiration, growth, energy of Ace of Wands.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Ace_of_Wands.jpg/400px-RWS_Tarot_Ace_of_Wands.jpg"
  },
  {
    "name": "Two of Wands",
    "meaning": "Inspiration, growth, energy of Two of Wands.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Two_of_Wands.jpg/400px-RWS_Tarot_Two_of_Wands.jpg"
  },
  {
    "name": "Three of Wands",
    "meaning": "Inspiration, growth, energy of Three of Wands.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Three_of_Wands.jpg/400px-RWS_Tarot_Three_of_Wands.jpg"
  },
  {
    "name": "Four of Wands",
    "meaning": "Inspiration, growth, energy of Four of Wands.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Four_of_Wands.jpg/400px-RWS_Tarot_Four_of_Wands.jpg"
  },
  {
    "name": "Five of Wands",
    "meaning": "Inspiration, growth, energy of Five of Wands.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Five_of_Wands.jpg/400px-RWS_Tarot_Five_of_Wands.jpg"
  },
  {
    "name": "Six of Wands",
    "meaning": "Inspiration, growth, energy of Six of Wands.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Six_of_Wands.jpg/400px-RWS_Tarot_Six_of_Wands.jpg"
  },
  {
    "name": "Seven of Wands",
    "meaning": "Inspiration, growth, energy of Seven of Wands.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Seven_of_Wands.jpg/400px-RWS_Tarot_Seven_of_Wands.jpg"
  },
  {
    "name": "Eight of Wands",
    "meaning": "Inspiration, growth, energy of Eight of Wands.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Eight_of_Wands.jpg/400px-RWS_Tarot_Eight_of_Wands.jpg"
  },
  {
    "name": "Nine of Wands",
    "meaning": "Inspiration, growth, energy of Nine of Wands.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Nine_of_Wands.jpg/400px-RWS_Tarot_Nine_of_Wands.jpg"
  },
  {
    "name": "Ten of Wands",
    "meaning": "Inspiration, growth, energy of Ten of Wands.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Ten_of_Wands.jpg/400px-RWS_Tarot_Ten_of_Wands.jpg"
  },
  {
    "name": "Page of Wands",
    "meaning": "Inspiration, growth, energy of Page of Wands.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Page_of_Wands.jpg/400px-RWS_Tarot_Page_of_Wands.jpg"
  },
  {
    "name": "Knight of Wands",
    "meaning": "Inspiration, growth, energy of Knight of Wands.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Knight_of_Wands.jpg/400px-RWS_Tarot_Knight_of_Wands.jpg"
  },
  {
    "name": "Queen of Wands",
    "meaning": "Inspiration, growth, energy of Queen of Wands.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Queen_of_Wands.jpg/400px-RWS_Tarot_Queen_of_Wands.jpg"
  },
  {
    "name": "King of Wands",
    "meaning": "Inspiration, growth, energy of King of Wands.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_King_of_Wands.jpg/400px-RWS_Tarot_King_of_Wands.jpg"
  },
  {
    "name": "Ace of Cups",
    "meaning": "Emotion, relationships, intuition of Ace of Cups.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Ace_of_Cups.jpg/400px-RWS_Tarot_Ace_of_Cups.jpg"
  },
  {
    "name": "Two of Cups",
    "meaning": "Emotion, relationships, intuition of Two of Cups.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Two_of_Cups.jpg/400px-RWS_Tarot_Two_of_Cups.jpg"
  },
  {
    "name": "Three of Cups",
    "meaning": "Emotion, relationships, intuition of Three of Cups.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Three_of_Cups.jpg/400px-RWS_Tarot_Three_of_Cups.jpg"
  },
  {
    "name": "Four of Cups",
    "meaning": "Emotion, relationships, intuition of Four of Cups.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Four_of_Cups.jpg/400px-RWS_Tarot_Four_of_Cups.jpg"
  },
  {
    "name": "Five of Cups",
    "meaning": "Emotion, relationships, intuition of Five of Cups.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Five_of_Cups.jpg/400px-RWS_Tarot_Five_of_Cups.jpg"
  },
  {
    "name": "Six of Cups",
    "meaning": "Emotion, relationships, intuition of Six of Cups.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Six_of_Cups.jpg/400px-RWS_Tarot_Six_of_Cups.jpg"
  },
  {
    "name": "Seven of Cups",
    "meaning": "Emotion, relationships, intuition of Seven of Cups.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Seven_of_Cups.jpg/400px-RWS_Tarot_Seven_of_Cups.jpg"
  },
  {
    "name": "Eight of Cups",
    "meaning": "Emotion, relationships, intuition of Eight of Cups.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Eight_of_Cups.jpg/400px-RWS_Tarot_Eight_of_Cups.jpg"
  },
  {
    "name": "Nine of Cups",
    "meaning": "Emotion, relationships, intuition of Nine of Cups.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Nine_of_Cups.jpg/400px-RWS_Tarot_Nine_of_Cups.jpg"
  },
  {
    "name": "Ten of Cups",
    "meaning": "Emotion, relationships, intuition of Ten of Cups.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Ten_of_Cups.jpg/400px-RWS_Tarot_Ten_of_Cups.jpg"
  },
  {
    "name": "Page of Cups",
    "meaning": "Emotion, relationships, intuition of Page of Cups.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Page_of_Cups.jpg/400px-RWS_Tarot_Page_of_Cups.jpg"
  },
  {
    "name": "Knight of Cups",
    "meaning": "Emotion, relationships, intuition of Knight of Cups.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Knight_of_Cups.jpg/400px-RWS_Tarot_Knight_of_Cups.jpg"
  },
  {
    "name": "Queen of Cups",
    "meaning": "Emotion, relationships, intuition of Queen of Cups.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Queen_of_Cups.jpg/400px-RWS_Tarot_Queen_of_Cups.jpg"
  },
  {
    "name": "King of Cups",
    "meaning": "Emotion, relationships, intuition of King of Cups.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_King_of_Cups.jpg/400px-RWS_Tarot_King_of_Cups.jpg"
  },
  {
    "name": "Ace of Swords",
    "meaning": "Intellect, conflict, clarity of Ace of Swords.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Ace_of_Swords.jpg/400px-RWS_Tarot_Ace_of_Swords.jpg"
  },
  {
    "name": "Two of Swords",
    "meaning": "Intellect, conflict, clarity of Two of Swords.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Two_of_Swords.jpg/400px-RWS_Tarot_Two_of_Swords.jpg"
  },
  {
    "name": "Three of Swords",
    "meaning": "Intellect, conflict, clarity of Three of Swords.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Three_of_Swords.jpg/400px-RWS_Tarot_Three_of_Swords.jpg"
  },
  {
    "name": "Four of Swords",
    "meaning": "Intellect, conflict, clarity of Four of Swords.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Four_of_Swords.jpg/400px-RWS_Tarot_Four_of_Swords.jpg"
  },
  {
    "name": "Five of Swords",
    "meaning": "Intellect, conflict, clarity of Five of Swords.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Five_of_Swords.jpg/400px-RWS_Tarot_Five_of_Swords.jpg"
  },
  {
    "name": "Six of Swords",
    "meaning": "Intellect, conflict, clarity of Six of Swords.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Six_of_Swords.jpg/400px-RWS_Tarot_Six_of_Swords.jpg"
  },
  {
    "name": "Seven of Swords",
    "meaning": "Intellect, conflict, clarity of Seven of Swords.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Seven_of_Swords.jpg/400px-RWS_Tarot_Seven_of_Swords.jpg"
  },
  {
    "name": "Eight of Swords",
    "meaning": "Intellect, conflict, clarity of Eight of Swords.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Eight_of_Swords.jpg/400px-RWS_Tarot_Eight_of_Swords.jpg"
  },
  {
    "name": "Nine of Swords",
    "meaning": "Intellect, conflict, clarity of Nine of Swords.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Nine_of_Swords.jpg/400px-RWS_Tarot_Nine_of_Swords.jpg"
  },
  {
    "name": "Ten of Swords",
    "meaning": "Intellect, conflict, clarity of Ten of Swords.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Ten_of_Swords.jpg/400px-RWS_Tarot_Ten_of_Swords.jpg"
  },
  {
    "name": "Page of Swords",
    "meaning": "Intellect, conflict, clarity of Page of Swords.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Page_of_Swords.jpg/400px-RWS_Tarot_Page_of_Swords.jpg"
  },
  {
    "name": "Knight of Swords",
    "meaning": "Intellect, conflict, clarity of Knight of Swords.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Knight_of_Swords.jpg/400px-RWS_Tarot_Knight_of_Swords.jpg"
  },
  {
    "name": "Queen of Swords",
    "meaning": "Intellect, conflict, clarity of Queen of Swords.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Queen_of_Swords.jpg/400px-RWS_Tarot_Queen_of_Swords.jpg"
  },
  {
    "name": "King of Swords",
    "meaning": "Intellect, conflict, clarity of King of Swords.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_King_of_Swords.jpg/400px-RWS_Tarot_King_of_Swords.jpg"
  },
  {
    "name": "Ace of Pentacles",
    "meaning": "Material, career, abundance of Ace of Pentacles.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Ace_of_Pentacles.jpg/400px-RWS_Tarot_Ace_of_Pentacles.jpg"
  },
  {
    "name": "Two of Pentacles",
    "meaning": "Material, career, abundance of Two of Pentacles.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Two_of_Pentacles.jpg/400px-RWS_Tarot_Two_of_Pentacles.jpg"
  },
  {
    "name": "Three of Pentacles",
    "meaning": "Material, career, abundance of Three of Pentacles.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Three_of_Pentacles.jpg/400px-RWS_Tarot_Three_of_Pentacles.jpg"
  },
  {
    "name": "Four of Pentacles",
    "meaning": "Material, career, abundance of Four of Pentacles.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Four_of_Pentacles.jpg/400px-RWS_Tarot_Four_of_Pentacles.jpg"
  },
  {
    "name": "Five of Pentacles",
    "meaning": "Material, career, abundance of Five of Pentacles.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Five_of_Pentacles.jpg/400px-RWS_Tarot_Five_of_Pentacles.jpg"
  },
  {
    "name": "Six of Pentacles",
    "meaning": "Material, career, abundance of Six of Pentacles.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Six_of_Pentacles.jpg/400px-RWS_Tarot_Six_of_Pentacles.jpg"
  },
  {
    "name": "Seven of Pentacles",
    "meaning": "Material, career, abundance of Seven of Pentacles.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Seven_of_Pentacles.jpg/400px-RWS_Tarot_Seven_of_Pentacles.jpg"
  },
  {
    "name": "Eight of Pentacles",
    "meaning": "Material, career, abundance of Eight of Pentacles.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Eight_of_Pentacles.jpg/400px-RWS_Tarot_Eight_of_Pentacles.jpg"
  },
  {
    "name": "Nine of Pentacles",
    "meaning": "Material, career, abundance of Nine of Pentacles.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Nine_of_Pentacles.jpg/400px-RWS_Tarot_Nine_of_Pentacles.jpg"
  },
  {
    "name": "Ten of Pentacles",
    "meaning": "Material, career, abundance of Ten of Pentacles.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Ten_of_Pentacles.jpg/400px-RWS_Tarot_Ten_of_Pentacles.jpg"
  },
  {
    "name": "Page of Pentacles",
    "meaning": "Material, career, abundance of Page of Pentacles.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Page_of_Pentacles.jpg/400px-RWS_Tarot_Page_of_Pentacles.jpg"
  },
  {
    "name": "Knight of Pentacles",
    "meaning": "Material, career, abundance of Knight of Pentacles.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Knight_of_Pentacles.jpg/400px-RWS_Tarot_Knight_of_Pentacles.jpg"
  },
  {
    "name": "Queen of Pentacles",
    "meaning": "Material, career, abundance of Queen of Pentacles.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_Queen_of_Pentacles.jpg/400px-RWS_Tarot_Queen_of_Pentacles.jpg"
  },
  {
    "name": "King of Pentacles",
    "meaning": "Material, career, abundance of King of Pentacles.",
    "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RWS_Tarot_King_of_Pentacles.jpg/400px-RWS_Tarot_King_of_Pentacles.jpg"
  }
];

export default cardData;
