// G_journal-prompt.js - v1.2.0

const { getDeepseekReply } = require("./G_deepseek");

const presetPrompts = [
  "What am I being invited to let go of in order to grow?",
  "Where in my life am I resisting change, and why?",
  "What message is my soul trying to send me right now?",
  "How can I better nurture my spiritual well-being this week?",
  "What limiting beliefs am I ready to release?",
  "In what area of life am I being called to step into my power?",
  "How does fear influence my decisions, and how can I transcend it?",
  "What part of myself have I been neglecting, and how can I honor it now?",
  "What does forgiveness mean to me, and who might need it?",
  "How can I better align my actions with my higher purpose?",
  "Where am I seeking validation externally, and what needs healing within?",
  "What truths am I afraid to face, and what strength lies behind them?",
  "How can I embrace the unknown with trust rather than control?",
  "What patterns am I repeating, and what is the lesson behind them?",
  "What is my soul craving more of, and how can I answer that call?",
  "What does balance look like for me, and where am I out of harmony?",
  "What old wounds are surfacing for healing, and how can I respond with love?",
  "What dream have I buried, and is it time to resurrect it?",
  "How does my inner child feel, and how can I reconnect with them?",
  "What do I need to surrender in order to receive more fully?",
  "What does self-love look like in practice for me today?"
];

const journalMemory = new Map();

async function getJournalPrompt(userId) {
  if (!journalMemory.has(userId)) {
    const index = Math.floor(Math.random() * presetPrompts.length);
    journalMemory.set(userId, true);
    return `📝 Journal Prompt\n\n${presetPrompts[index]}`;
  } else {
    const prompt = "Please provide a deep and introspective spiritual journal prompt for a soul seeking clarity, healing, and personal growth.";
    const reply = await getDeepseekReply(prompt);
    return `📝 Journal Prompt\n\n${reply}`;
  }
}

module.exports = { getJournalPrompt };
