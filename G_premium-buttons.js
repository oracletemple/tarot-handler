// G_premium-buttons.js - v1.3.1

const { InlineKeyboard } = require("telegraf");
const premiumGroups = [
  [
    { text: "🧘 Higher Self", callback_data: "premium_higher" },
    { text: "🪞 Mirror Message", callback_data: "premium_mirror" },
    { text: "🌀 Energy Reading", callback_data: "premium_energy" },
  ],
  [
    { text: "🔭 Soul Purpose", callback_data: "premium_purpose" },
    { text: "🧿 Past Life Echoes", callback_data: "premium_pastlife" },
    { text: "🕯 Karmic Cycle", callback_data: "premium_karma" },
  ],
  [
    { text: "⛩ Sacred Symbol", callback_data: "premium_symbol" },
    { text: "🌬 Message from Spirit", callback_data: "premium_spirit" },
    { text: "⏳ Divine Timing", callback_data: "premium_timing" },
  ],
  [
    { text: "🪄 Oracle Card", callback_data: "premium_oracle" },
    { text: "🌌 Cosmic Alignment", callback_data: "premium_cosmic" },
    { text: "📝 Journal Prompt", callback_data: "premium_journal" },
  ],
  [
    { text: "🕳 Shadow Message", callback_data: "premium_shadow" },
    { text: "👤 Soul Archetype", callback_data: "premium_archetype" },
    { text: "🔮 Tarot Summary", callback_data: "premium_summary" },
  ]
];

async function renderPremiumButtons(chatId, messageId, index = 0) {
  const group = premiumGroups[index] || [];
  const nextGroupExists = index + 1 < premiumGroups.length;

  const buttons = group.map((item) => [{ text: item.text, callback_data: item.callback_data }]);

  if (nextGroupExists) {
    buttons.push([{ text: "Next ➡️", callback_data: `next_${index + 1}` }]);
  }

  const axios = require("axios");
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

  await axios.post(`${API_URL}/sendMessage`, {
    chat_id: chatId,
    text: "✨ Choose your premium guidance:",
    reply_markup: {
      inline_keyboard: buttons
    },
  });
}

module.exports = { renderPremiumButtons };
