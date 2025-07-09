// G_gpt-analysis.js - v1.2.0

const { getDeepseekReply } = require("./G_deepseek");

const fixedInterpretations = [
  "Your spread speaks of deep soul evolution. Each card reflects a step in your sacred becoming.",
  "You are being called to transmute old wounds into spiritual wisdom. The journey is not linear—but it is divine.",
  "This reading is a mirror of your awakening. The universe is gently reshaping you into your highest form.",
  "You are entering a liminal space, where endings and beginnings dance together. Trust the unseen forces guiding you.",
  "The cards reveal a karmic wave passing through your life—bringing healing, truth, and eventual grace.",
  "You are being reborn from the ashes of your former self. Rise with the wisdom of all you’ve survived.",
  "These messages hold more than answers—they offer initiation. You are stepping through a soul threshold.",
  "A spiritual contract is unfolding. You are not lost—you are learning to listen to the voice within.",
  "Even in confusion, the cards assure you: your essence is intact, your spirit resilient.",
  "You’ve been chosen to carry light through the shadows. Let your inner fire guide the way.",
  "This is more than a reading—it’s a remembrance of who you are before the world told you otherwise.",
  "You are guided, not by fate, but by choice. Your path is sacred. Your presence is power.",
  "The truth you seek is already within you. These cards simply illuminate what your soul already knows.",
  "You are not alone. Spirit walks beside you, speaking through signs, dreams, and quiet knowing.",
  "The path ahead is shaped by courage. Step through the uncertainty with trust in your deeper self.",
  "There is no mistake—only experience. Your journey is holy, no matter how messy it may feel.",
  "What you perceive as delays are divine recalibrations. The timing is orchestrated by something greater.",
  "This spread is an invitation to release, realign, and rise. You are entering a season of soul sovereignty.",
  "The universe is not testing you—it’s teaching you to access your power under pressure.",
  "The symbols before you whisper sacred truths. Stillness will unlock their messages.",
  "Everything happening now is preparing you to embody your purpose with clarity and strength."
];

const analysisMemory = new Map();

async function getGptAnalysis(userId, cards) {
  if (!analysisMemory.has(userId)) {
    const random = fixedInterpretations[Math.floor(Math.random() * fixedInterpretations.length)];
    analysisMemory.set(userId, true);
    return `🧠 Spiritual Insight\n\n${random}`;
  } else {
    const prompt = `You are a professional spiritual guide. The user received the following three tarot cards in a reading:\n\n1. ${cards[0].name}: ${cards[0].meaning}\n2. ${cards[1].name}: ${cards[1].meaning}\n3. ${cards[2].name}: ${cards[2].meaning}\n\nPlease provide a deep, symbolic, emotionally resonant interpretation of the overall spiritual message, transformation, or life lesson indicated by these three cards. Do not just summarize—give insight like a mystic would.`;
    const reply = await getDeepseekReply(prompt);
    return `🧠 Spiritual Insight\n\n${reply}`;
  }
}

module.exports = { getGptAnalysis };
