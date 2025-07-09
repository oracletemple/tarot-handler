// G_message-spirit.js - v1.2.0

const axios = require("axios");

const presetMessages = [
  "A gentle whisper from the spirit realm urges you to trust your path, even when it feels uncertain.",
  "Your guardian spirit reminds you that every delay is divine protection.",
  "A presence watches over you with compassion, urging you to forgive yourself.",
  "Spirit says: Look inward, for the answers you seek have always lived within you.",
  "Your spirit guide wants you to release the weight that no longer belongs to your soul.",
  "In the silence, spirit speaks. Make space for sacred stillness.",
  "A message from beyond: Let love—not fear—guide your choices.",
  "You are never truly alone. A spirit walks beside you in quiet strength.",
  "Spirit says: Your dreams are seeds. Nurture them with faith.",
  "The veil is thin. Pay attention to the signs spirit places in your path.",
  "Your ancestors whisper: You carry our strength within your bones.",
  "The divine reminds you—your existence is not an accident. You are meant to shine.",
  "Spirit encourages you to rest. Restoration is sacred.",
  "There is wisdom in the wind, spirit says. Let it carry away your doubts.",
  "Messages come in mysterious ways. Trust what stirs your intuition.",
  "Your soul is seen. Spirit affirms your journey is sacred.",
  "Spirit nudges you toward the unknown—for that is where your growth awaits.",
  "You are loved beyond understanding. Spirit sees your light.",
  "This moment is holy. Spirit invites you to be fully present.",
  "A message arises: Release comparison. Your path is uniquely divine.",
  "Spirit says: Trust in timing, even when it feels late."
];

function getRandomSpiritMessage() {
  const index = Math.floor(Math.random() * presetMessages.length);
  return `🌬 *Message from Spirit* \n\n${presetMessages[index]}`;
}

async function getAIMessageFromSpirit() {
  try {
    const res = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are a mystical spirit guide. Give a poetic, symbolic, and gentle message to the user, as if whispering from beyond the veil."
          },
          {
            role: "user",
            content: "What message does the spirit world have for me today?"
          }
        ],
        temperature: 1
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer sk-cf17088ece0a4bc985dec1464cf504e1`
        }
      }
    );

    const text = res.data.choices[0].message.content.trim();
    return `🌬 *Message from Spirit* \n\n${text}`;
  } catch (err) {
    console.error("[Spirit API Error]", err.message);
    return getRandomSpiritMessage();
  }
}

module.exports = {
  getMessageFromSpirit: async (userId) => {
    if (!globalThis.__spirit_called) {
      globalThis.__spirit_called = {};
    }

    if (!globalThis.__spirit_called[userId]) {
      globalThis.__spirit_called[userId] = true;
      return getRandomSpiritMessage();
