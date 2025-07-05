// v1.1.2
const sessions = new Map();

function startSession(userId) {
  sessions.set(userId, {
    drawn: [],
    complete: false
  });
}

function getCard(userId, index) {
  const session = sessions.get(userId);
  if (!session || session.drawn.length >= 3 || session.complete) return null;

  const card = generateCard();
  session.drawn.push(card);

  if (session.drawn.length === 3) {
    session.complete = true;
  }

  return card;
}

function isSessionComplete(userId) {
  const session = sessions.get(userId);
  return session?.complete || false;
}

function generateCard() {
  const suits = ['Cups', 'Wands', 'Swords', 'Pentacles'];
  const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Page', 'Knight', 'Queen', 'King'];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const value = values[Math.floor(Math.random() * values.length)];
  return `${value} of ${suit}`;
}

module.exports = {
  startSession,
  getCard,
  isSessionComplete
};
