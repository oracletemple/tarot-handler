// G_soul-purpose.js - v1.0.1
const axios = require("axios");

const deepseekKey = "sk-cf17088ece0a4bc985dec1464cf504e1"; // tarot-bot-key

const fixedMessages = [
  `🔭 *Soul Purpose Insight*\n\nYou were born to be a light bearer—someone who guides others through dark transitions. Your presence brings clarity, even when you feel uncertain within.`,
  `🔭 *Soul Purpose Insight*\n\nYour soul carries the blueprint of a healer. Whether through words, presence, or touch, you are meant to soothe, restore, and realign those around you.`,
  `🔭 *Soul Purpose Insight*\n\nYou are a truth-seeker. Your purpose involves questioning, breaking illusions, and revealing what lies beneath the surface—no matter how uncomfortable.`,
  `🔭 *Soul Purpose Insight*\n\nYour journey is one of creativity. Through art, expression, or innovation, you are here to channel the divine into form.`,
  `🔭 *Soul Purpose Insight*\n\nYou are meant to challenge systems and awaken others. You're not here to fit in—you’re here to reimagine what’s possible.`,
  `🔭 *Soul Purpose Insight*\n\nYou are a spiritual bridge—linking realms, generations, or belief systems. You embody unity and expansion.`,
  `🔭 *Soul Purpose Insight*\n\nYour path is one of compassion in action. You are here to serve, uplift, and defend those without a voice.`,
  `🔭 *Soul Purpose Insight*\n\nLeadership is your sacred contract. Your soul signed up to take responsibility, even when it feels heavy. You guide through integrity.`,
  `🔭 *Soul Purpose Insight*\n\nYou are a sacred mirror. Your interactions awaken self-awareness in others. Simply by being, you help people remember who they are.`,
  `🔭 *Soul Purpose Insight*\n\nYou’re a timeline weaver. Your soul purpose may include healing ancestral patterns or shifting collective karma.`,
  `🔭 *Soul Purpose Insight*\n\nYour role is to plant seeds of transformation, even if you don't see the garden bloom. Trust your ripple.`,
  `🔭 *Soul Purpose Insight*\n\nYou are a keeper of ancient wisdom. Even if you doubt yourself, you carry insights from lifetimes past.`,
  `🔭 *Soul Purpose Insight*\n\nYour soul thrives in contrast. You were built to walk both shadow and light—to embody paradox with grace.`,
  `🔭 *Soul Purpose Insight*\n\nYou're here to embody presence. In a world of distraction, your attention is medicine.`,
  `🔭 *Soul Purpose Insight*\n\nYou're a pathfinder. Others watch how you navigate the unknown so they too can trust their own steps.`,
  `🔭 *Soul Purpose Insight*\n\nYou are a threshold guardian. Your soul agreed to witness others through birth, death, and rebirth cycles.`,
  `🔭 *Soul Purpose Insight*\n\nYou are a voice of the unseen. Whether through intuition or creation, you bring the hidden into form.`,
  `🔭 *Soul Purpose Insight*\n\nYour soul craves meaning. You're here to help others find depth beneath the surface noise.`,
  `🔭 *Soul Purpose Insight*\n\nYou are a visionary. You dream of futures that don't exist yet, and your faith makes them possible.`,
  `🔭 *Soul Purpose Insight*\n\nYou carry frequencies of peace. Simply being in your energy restores balance in chaotic spaces.`,
  `🔭 *Soul Purpose Insight*\n\nYour purpose is to awaken hearts. You carry the courage to feel deeply and help others open.`
];

function getRandomSoulPurpose() {
  const i = Math.floor(Math.random() * fixedMessages.length);
  return fixedMessages[i];
}

async function getSoulPurpose(wasUsedBefore = false) {
  if (!wasUsedBefore) {
    return getRandomSoulPurpose();
  }

  const prompt = `Offer a deep and poetic spiritual message that helps someone understand their soul purpose. Avoid cliches. Use symbolic, wise language.`;
  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
        max_tokens: 600,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${deepseekKey}`,
        },
      }
    );

    const text = response.data.choices[0].message.content.trim();
    return `🔭 *Soul Purpose Insight*\n\n${text}`;
  } catch (err) {
    console.error("DeepSeek API Error:", err.message);
    return "🌀 Your soul purpose is still forming... try again later.";
  }
}

module.exports = { getSoulPurpose };
