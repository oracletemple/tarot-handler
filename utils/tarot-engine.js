// utils/tarot-engine.js - v1.1.1
import cardData from "./card-data.js";

export function drawCards() {
  const selected = [];
  const usedIndexes = new Set();

  while (selected.length < 3) {
    const i = Math.floor(Math.random() * cardData.length);
    if (!usedIndexes.has(i)) {
      usedIndexes.add(i);
      selected.push(cardData[i]);
    }
  }

  return selected;
}
