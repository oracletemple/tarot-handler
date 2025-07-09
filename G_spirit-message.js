// G_spirit-message.js - v1.2.0

const { getDeepseekReply } = require("./G_deepseek");

const presetMessages = [
  "🌬 A spirit whispers: 'You are not alone. I walk beside you in every unseen step.'",
  "🌬 A guide speaks: 'Trust the pull in your chest—that’s me calling you forward.'",
  "🌬 Message: 'The signs you’ve asked for are already around you. Slow down. Look again.'",
  "🌬 A voice from beyond: 'Let the past be sacred, not heavy. I’ve carried it too—now we let go together.'",
  "🌬 Spirit says: 'In your silence, I sing. In your sorrow, I send light.'",
  "🌬 Message from your guide: 'The detour was never punishment—it was divine redirection.'",
  "🌬 An ancestor whispers: 'You carry our strength. Keep walking. We are proud of you.'",
  "🌬 Spirit speaks: 'Even when you doubted, we were cheering. You are seen.'",
  "🌬 A gentle reminder: 'Your tears are holy. Let them baptize your becoming.'",
  "🌬 A presence surrounds you: 'This very moment is a blessing. Receive it fully.'"
];

const spiritMemory = new Map();

async function getSpiritMessage(userId) {
  if (!spiritMemory.has(userId)) {
    const index = Math.floor(Math.random() * presetMessages.length);
    spiritMemory.set(userId, true);
    return presetMessages[index];
  } else {
    const prompt = "Speak as a loving spirit guide. Offer the user a symbolic, emotionally supportive message as if whispered from the unseen. Keep it comforting and poetic.";
    const reply = await getDeepseekReply(prompt);
    return `🌬 Message from Spirit\n\n${reply}`;
  }
}

module.exports = { getSpiritMessage };
