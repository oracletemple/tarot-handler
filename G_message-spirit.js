/*
 G_message-spirit.js - v1.0.2
 Always fetch via API. Message from Spirit insight capped at 100 words.
*/
const { getDeepseekReply } = require("./G_deepseek");
const MAX_WORDS_SPIRITMSG = 100;

function enforceWordLimitSpiritMsg(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

async function getMessageSpirit(userId) {
  const prompt = `A user has requested a Message from Spirit. Provide a gentle, wise communication that feels like a higher guidance voice. Limit your response to no more than ${MAX_WORDS_SPIRITMSG} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `🌬 Message from Spirit\n\n${reply}`;
  return enforceWordLimitSpiritMsg(result, MAX_WORDS_SPIRITMSG);
}

module.exports = { getMessageSpirit };
