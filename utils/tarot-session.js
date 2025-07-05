// v1.1.9
const sessions = {};

const allCards = [
  { name: "The Fool", meaning: "New beginnings, spontaneity, free spirit" },
  { name: "The Magician", meaning: "Power, skill, concentration" },
  { name: "The High Priestess", meaning: "Intuition, mystery, subconscious mind" },
  { name: "The Empress", meaning: "Femininity, beauty, nature" },
  { name: "The Emperor", meaning: "Authority, structure, control" },
  { name: "The Hierophant", meaning: "Tradition, conformity, morality" },
  { name: "The Lovers", meaning: "Love, harmony, relationships" },
  { name: "The Chariot", meaning: "Control, willpower, determination" },
  { name: "Strength", meaning: "Courage, patience, inner strength" },
  { name: "The Hermit", meaning: "Introspection, soul-searching, inner guidance" },
  { name: "Wheel of Fortune", meaning: "Luck, karma, life cycles" },
  { name: "Justice", meaning: "Truth, fairness, law" },
  { name: "The Hanged Man", meaning: "Sacrifice, release, new perspective" },
  { name: "Death", meaning: "Endings, change, transformation" },
  { name: "Temperance", meaning: "Balance, moderation, purpose" },
  { name: "The Devil", meaning: "Addiction, materialism, playfulness" },
  { name: "The Tower", meaning: "Disaster, upheaval, sudden change" },
  { name: "The Star", meaning: "Hope, faith, rejuvenation" },
  { name: "The Moon", meaning: "Illusion, fear, anxiety" },
  { name: "The Sun", meaning: "Joy, success, vitality" },
  { name: "Judgement", meaning: "Reflection, reckoning, awakening" },
  { name: "The World", meaning: "Completion, celebration, accomplishment" },
];

function startSession(userId) {
  if (!sessions[userId]) {
    const shuffled = [...allCards].sort(() => 0.5 - Math.random());
    sessions[userId] = {
      cards: shuffled.slice(0, 3),
      drawn: [],
    };
  }
}

function getCard(userId, index) {
  const session = sessions[userId];
  if (!session || session.drawn.includes(index)) return { name: "❌", meaning: "Card already drawn." };

  session.drawn.push(index);
  return session.cards[index];
}

function isSessionComplete(userId) {
  const session = sessions[userId];
  return session && session.drawn.length >= 3;
}

module.exports = { startSession, getCard, isSessionComplete };
