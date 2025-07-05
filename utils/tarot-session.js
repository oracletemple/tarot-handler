// v1.0.11
const sessions = {};

function startSession(userId) {
  sessions[userId] = {
    cards: [],
    drawn: [false, false, false],
  };
}

function getCard(userId, index) {
  if (!sessions[userId]) return null;
  if (sessions[userId].drawn[index]) return null;

  const card = drawRandomCard();
  sessions[userId].cards[index] = card;
  sessions[userId].drawn[index] = true;
  return card;
}

function isSessionComplete(userId) {
  return sessions[userId]?.drawn.every(Boolean);
}

function drawRandomCard() {
  const cards = [
    'The Fool', 'The Magician', 'The High Priestess', 'The Empress',
    'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot',
    'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice',
    'The Hanged Man', 'Death', 'Temperance', 'The Devil',
    'The Tower', 'The Star', 'The Moon', 'The Sun',
    'Judgement', 'The World'
  ];
  const index = Math.floor(Math.random() * cards.length);
  return cards[index];
}

module.exports = {
  startSession,
  getCard,
  isSessionComplete,
};
