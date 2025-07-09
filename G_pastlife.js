// G_pastlife.js - v1.2.0

const axios = require("axios");

const fixedMessages = [
  "You once walked the streets of a forgotten empire, your voice carrying wisdom others feared.",
  "A sailor in the age of exploration, your soul still hears the call of uncharted waters.",
  "You lived as a healer, shunned by some, but revered by those you helped transform.",
  "Your past echoes through the halls of temples, where you once whispered to the divine.",
  "You were a truth-seeker, punished for your vision, yet never silenced by fear.",
  "A nomadic storyteller, you carried myths that shaped cultures.",
  "You were a silent guardian in times of war—your strength unrecognized, but unwavering.",
  "An alchemist lost in obsessions, searching for the philosopher's stone within.",
  "Once a rebel, your soul still yearns to break chains that bind others.",
  "You danced in sacred rituals, channeling energies beyond the visible world.",
  "You were a forgotten queen, ruling through wisdom and restraint.",
  "Your hands created sacred art that outlived dynasties.",
  "You walked with wolves, a soul at home in the wild's untamed truth.",
  "You once mapped stars to guide empires—your intuition was their compass.",
  "You lived in silence by choice, a mystic monk shedding ego for truth.",
  "A child oracle, burdened with foresight, your gift both a blessing and a curse.",
  "You built sanctuaries, only to see them fall. But your devotion never crumbled.",
  "You held the secrets of herbs and moon phases—now resurfacing in dreams.",
  "Your past life ended unjustly, your soul still seeks closure and voice.",
  "You led a pilgrimage that changed others—but you remained unseen.",
  "You once surrendered everything for love. That echo still shapes your choices now."
];

const history = new Map();

async function getPremiumPastLife(userId) {
  if (!history.has(userId)) {
    const random = fixedMessages[Math.floor(Math.random() * fixedMessages.length)];
    history.set(userId, true);
    return `🧿 *Past Life Echoes*\n\n_${random}_`;
  }

  try {
    const res = await axios.post("https://api.deepseek.com/chat/completions", {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a mystical guide skilled in interpreting past life visions in a symbolic, gentle, and empowering tone. Avoid religious or deterministic claims."
        },
        {
          role: "user",
          content: "Can you reveal something symbolic and meaningful from my past life?"
        }
      ]
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    return `🧿 *Past Life Echoes*\n\n${res.data.choices[0].message.content}`;
  } catch (err) {
    console.error("❌ getPremiumPastLife error:", err.response?.data || err.message);
    return "🧿 *Past Life Echoes*\n\nUnable to retrieve your past life insight at this moment.";
  }
}

module.exports = { getPremiumPastLife };
