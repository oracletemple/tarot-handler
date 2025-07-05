// utils/tarot.js
// v1.1.3 - 抽牌与含义生成，支持 getMeaning 输出说明

const tarotDeck = [
  { name: 'The Fool', meaning: 'New beginnings, optimism, trust in life' },
  { name: 'The Magician', meaning: 'Action, the power to manifest' },
  { name: 'The High Priestess', meaning: 'Inaction, going within, the subconscious' },
  { name: 'The Empress', meaning: 'Abundance, nurturing, fertility, life in bloom!' },
  { name: 'The Emperor', meaning: 'Structure, stability, rules and power' },
  { name: 'The Hierophant', meaning: 'Institutions, tradition, society and its rules' },
  { name: 'The Lovers', meaning: 'Sexuality, passion, choice, uniting' },
  { name: 'The Chariot', meaning: 'Movement, progress, integration' },
  { name: 'Strength', meaning: 'Courage, subtle power, integration of animal self' },
  { name: 'The Hermit', meaning: 'Meditation, solitude, consciousness' },
  { name: 'Wheel of Fortune', meaning: 'Cycles, change, ups and downs' },
  { name: 'Justice', meaning: 'Fairness, equality, balance' },
  { name: 'The Hanged Man', meaning: 'Surrender, new perspective, enlightenment' },
  { name: 'Death', meaning: 'The end of something, change, the impermeability of all things' },
  { name: 'Temperance', meaning: 'Balance, moderation, being sensible' },
  { name: 'The Devil', meaning: 'Destructive patterns, addiction, giving away your power' },
  { name: 'The Tower', meaning: 'Collapse of stable structures, release, sudden insight' },
  { name: 'The Star', meaning: 'Hope, calm, a good omen!' },
  { name: 'The Moon', meaning: 'Mystery, the subconscious, dreams' },
  { name: 'The Sun', meaning: 'Success, happiness, all will be well' },
  { name: 'Judgement', meaning: 'Rebirth, a new phase, inner calling' },
  { name: 'The World', meaning: 'Completion, wholeness, attainment, celebration of life' },
  { name: '9 of Cups', meaning: 'Emotional fulfillment, satisfaction, comfort' },
  { name: '3 of Swords', meaning: 'Heartbreak, sorrow, grief, painful separation' },
  { name: '7 of Pentacles', meaning: 'Patience, hard work, delayed success' }
];

function drawCards(count) {
  const shuffled = tarotDeck.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getMeaning(card) {
  return `💬 *Meaning*: ${card.meaning}`;
}

module.exports = {
  drawCards,
  getMeaning
};
