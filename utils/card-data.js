// tarot-handler/data/card-data.js  // v1.1.0

const tarotCards = [
  {
    id: 1,
    name: "The Fool",
    position: "upright",
    positionName: "Past",
    image: null,
    meaning: {
      title: "New beginnings, spontaneity",
      love: "A new relationship or fresh start in love",
      advice: "Take a leap of faith and trust the process",
      warning: "Watch for reckless decisions"
    }
  },
  {
    id: 2,
    name: "The Magician",
    position: "reversed",
    positionName: "Present",
    image: null,
    meaning: {
      title: "Manipulation, poor planning",
      love: "Lack of commitment or trickery",
      advice: "Reclaim your personal power",
      warning: "Don't let others control your narrative"
    }
  },
  {
    id: 3,
    name: "The High Priestess",
    position: "upright",
    positionName: "Future",
    image: null,
    meaning: {
      title: "Intuition, inner voice",
      love: "Secrets in the relationship or emotional depth",
      advice: "Trust your instincts and be still",
      warning: "Don't ignore your inner voice"
    }
  }
];

module.exports = tarotCards;
