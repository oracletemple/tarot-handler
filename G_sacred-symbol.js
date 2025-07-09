// G_sacred-symbol.js - v1.2.0

const { getDeepseekReply } = require("./G_deepseek");

const presetSymbols = [
  "🌀 The Spiral: Growth is not linear. You are circling inward toward deep truth.",
  "🌿 The Tree: You are rooted and rising. Your growth blesses the lineage.",
  "🦋 The Butterfly: Transformation is complete. Spread your wings.",
  "🔥 The Flame: Your passion is divine. Let it illuminate and purify.",
  "🌕 The Moon: Emotions ebb and flow. Trust your intuitive tides.",
  "🕊 The Dove: Peace is your essence. Release what disturbs your spirit.",
  "🗝 The Key: You already hold the answer. Look within.",
  "🌈 The Rainbow: You are the bridge between storms and serenity.",
  "⛰ The Mountain: You are enduring. The summit is within sight.",
  "💧 The Drop: Small shifts ripple outward. Your presence impacts the whole."
];

const symbolMemory = new Map();

async function getSacredSymbol(userId) {
  if (!symbolMemory.has(userId)) {
    const index = Math.floor(Math.random() * presetSymbols.length);
    symbolMemory.set(userId, true);
    return `⛩ Sacred Symbol\n\n${presetSymbols[index]}`;
  } else {
    const prompt = "Offer the user a sacred symbol and describe its spiritual significance. Use poetic and mystical language, and explain how the symbol relates to their inner path or current energy.";
    const reply = await getDeepseekReply(prompt);
    return `⛩ Sacred Symbol\n\n${reply}`;
  }
}

module.exports = { 
  getSacredSymbol,
  getPremiumSymbol: getSacredSymbol };
