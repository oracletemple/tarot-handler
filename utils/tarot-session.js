const sessions = new Map();

function startSession(userId) {
  sessions.set(userId, { cards: [] });
}

function getCard(userId, index) {
  const session = sessions.get(userId);
  if (!session || session.cards.length >= 3) return null;
  const card = drawCard();
  session.cards.push(card);
  return card;
}

function isSessionComplete(userId) {
  const session = sessions.get(userId);
  return session && session.cards.length === 3;
}

function drawCard() {
  const cards = ["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor"];
  const meanings = [
    "New beginnings, spontaneity, innocence",
    "Willpower, creation, manifestation",
    "Intuition, mystery, subconscious mind",
    "Fertility, beauty, nature, nurturing",
    "Authority, structure, control"
  ];
  const index = Math.floor(Math.random() * cards.length);
  return { name: cards[index], meaning: meanings[index] };
}

module.exports = { startSession, getCard, isSessionComplete };
