/*
 G_journal-prompt.js - v1.0.1
 Always fetch via API. Journal Prompt insight capped at 100 words.
*/
const { getDeepseekReply } = require("./G_deepseek");
const MAX_WORDS_JOURNAL = 100;

function enforceWordLimit(text, maxWords) {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + "...";
}

async function getJournalPrompt(userId) {
  const prompt = `A user has requested their Journal Prompt. Provide a thoughtful, open-ended journaling question that encourages self-exploration and reflection. Limit your response to no more than ${MAX_WORDS_JOURNAL} words.`;
  const reply = await getDeepseekReply(prompt);
  const result = `📔 Journal Prompt\n\n${reply}`;
  return enforceWordLimit(result, MAX_WORDS_JOURNAL);
}

module.exports = { getJournalPrompt };
