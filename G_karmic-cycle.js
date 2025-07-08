// G_karmic-cycle.js - v1.0.0

const usedOnce = new Set();

const karmicInsights = [
  "You are walking a path once walked before. This moment is not new, but a karmic echo asking to be heard.",
  "The energy you feel today is an answer to choices made in lifetimes past. Listen to what repeats.",
  "There is a lesson in every cycle. Yours now is patience — with others, with fate, and with yourself.",
  "Forgiveness clears karma faster than time. Who or what must be released now?",
  "Not all debts are burdens. Some are sacred contracts, pulling you toward growth.",
  "Karmic tides are turning. What was withheld may now return — if your heart is open.",
  "You are not a prisoner of your past. But the cycle repeats until awareness intervenes.",
  "When discomfort rises, ask: Is this mine, or a karmic inheritance? Your awareness is the beginning of freedom.",
  "You’ve met them before — not in this life perhaps, but the soul remembers. What unfinished lesson is stirring?",
  "To break a karmic chain, act differently than you’ve ever acted before.",
  "Some struggles are not punishments — they are soul sculptors. You’re being refined, not condemned.",
  "Your soul chose this moment long before your body did. Trust its wisdom.",
  "You are the ancestor’s hope. The karmic thread you untangle today frees generations.",
  "Patterns repeat until integrated. This isn’t failure, it’s an invitation to deeper mastery.",
  "Don’t rush the release. Karma clears like tides: in waves, in layers, in time.",
  "A karmic bond is loosening. It may feel like grief — or liberation.",
  "What you give today echoes forward. Choose intentions that your future self will thank you for.",
  "Karma is not punishment. It is a mirror. What is life reflecting to you now?",
  "Honor your past, but walk forward. You are here to evolve, not repeat.",
  "Even silence carries karma. What have you left unsaid that still holds weight?",
  "You are not broken. You are being re-aligned through the invisible currents of time."
];

function getKarmicCycle() {
  const unused = karmicInsights.filter(text => !usedOnce.has(text));
  const pick = unused.length > 0 ? unused[Math.floor(Math.random() * unused.length)] : karmicInsights[Math.floor(Math.random() * karmicInsights.length)];
  usedOnce.add(pick);
  return `🕯 *Karmic Cycle*

${pick}`;
}

// ✅ DeepSeek 接入（第二次调用开始使用）
const axios = require("axios");
const DEEPSEEK_KEY = "sk-cf17088ece0a4bc985dec1464cf504e1";

async function getKarmicCycleFromAPI() {
  try {
    const res = await axios.post("https://api.deepseek.com/chat/completions", {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a spiritual guide offering symbolic, insightful reflections on karmic cycles." },
        { role: "user", content: "Please offer a spiritual reflection on a karmic cycle I may be in now."
        }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${DEEPSEEK_KEY}`,
        "Content-Type": "application/json"
      }
    });
    return `🕯 *Karmic Cycle*

${res.data.choices[0].message.content.trim()}`;
  } catch (e) {
    return "🕯 *Karmic Cycle*

The karmic threads are tangled today. Please try again soon.";
  }
}

module.exports = { getKarmicCycle, getKarmicCycleFromAPI };
