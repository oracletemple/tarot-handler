// G_journal-prompt.js - v1.1.0
const axios = require("axios");

const presetPrompts = [
  "📝 What truth have I been avoiding that is ready to be embraced?",
  "🌑 Where in my life am I being called to surrender control?",
  "🔥 What inner desire am I ready to give voice to?",
  "🌊 How can I honor my emotions without becoming them?",
  "🪞 What reflection from the past is asking to be re-examined now?",
  "🌱 What part of me is ready to grow, even if it's uncomfortable?",
  "🕯 What inner wisdom have I been ignoring lately?",
  "⚖️ Where do I need better boundaries to reclaim my energy?",
  "💫 What am I being invited to trust, even without evidence?",
  "📿 What does spiritual alignment feel like in my body today?",
  "🎭 What masks am I wearing that no longer serve me?",
  "🌬 How can I bring more truth into my daily conversations?",
  "🌀 What story do I need to rewrite in order to evolve?",
  "🌙 What message is the moon whispering to me tonight?",
  "⏳ What am I rushing that needs sacred patience?",
  "🦋 How am I being transformed in unseen ways?",
  "💌 What am I afraid to say, but deeply long to express?",
  "🌈 Where have I forgotten to celebrate my uniqueness?",
  "🔮 What future version of me is calling for my attention?",
  "🌿 Where do I feel most rooted, and how can I return there?",
  "📚 What lesson is life teaching me right now, if I truly listen?"
];

const usedApiSet = new Set();

function getJournalPrompt(userId) {
  if (!usedApiSet.has(userId)) {
    usedApiSet.add(userId);
    const random = Math.floor(Math.random() * presetPrompts.length);
    return presetPrompts[random];
  } else {
    return callDeepSeekPrompt();
  }
}

async function callDeepSeekPrompt() {
  const apiKey = "sk-cf17088ece0a4bc985dec1464cf504e1";
  const prompt = `Offer a poetic and reflective journaling question that invites the user into spiritual self-inquiry.`;

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.85,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("DeepSeek API error (journal):", err.message);
    return "⚠️ Your inner voice is quiet now. Try again in a few moments.";
  }
}

module.exports = { getJournalPrompt };
