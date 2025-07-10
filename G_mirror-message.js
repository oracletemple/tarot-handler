// -- G_mirror-message.js - v1.0.0
const { getDeepseekReply: _mirror } = require("./G_deepseek");

async function getPremiumMirror(userId) {
  const prompt = "Offer a reflective mirror message that helps the user see hidden aspects of their personality and provides gentle guidance for self-awareness and growth.";
  const reply = await _mirror(prompt);
  return `🪞 Mirror Message\n\n${reply}`;
}

module.exports = { getPremiumMirror };
