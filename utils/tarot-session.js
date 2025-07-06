// utils/tarot-session.js - v1.1.1
import { drawCards } from "./tarot-engine.js";

const sessions = new Map();

export async function startSession(userId, amount) {
  const cards = drawCards();
  sessions.set(userId, {
    cards,
    drawn: {},
    amount,
  });
}

export function getCard(userId, index) {
  const session = sessions.get(userId);
  if (!session) return null;

  const key = `card_${index}`;
  if (session.drawn[key]) return null; // Prevent duplicate

  const card = session.cards[index - 1];
  session.drawn[key] = true;
  return card;
}

export function isSessionComplete(userId) {
  const session = sessions.get(userId);
  if (!session) return true;
  return Object.keys(session.drawn).length >= 3;
}

export function endSession(userId) {
  sessions.delete(userId);
}
