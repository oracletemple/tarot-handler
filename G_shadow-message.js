// G_shadow-message.js - v1.2.0

const { getDeepseekReply } = require("./G_deepseek");

const presetShadows = [
  "Your shadow reminds you: unacknowledged emotions will find a voice—will you listen before they scream?",
  "There is wisdom in your wounds. What you’ve buried still shapes your choices.",
  "Fear not your darkness; it is the fertile ground for your transformation.",
  "Avoiding your shadow keeps you in cycles. Face it and you break free.",
  "Your anger holds truth. Let it guide you to what needs healing, not harm.",
  "Every judgment you make is a mirror—what do you refuse to see in yourself?",
  "Insecurity often points to suppressed brilliance. Where have you hidden your light?",
  "Shame thrives in secrecy. Speaking it dissolves its power.",
  "Your shadow craves compassion, not punishment. Meet it with love.",
  "What triggers you teaches you. Pay attention—it’s showing you the unfinished work.",
  "That which you repress becomes your master. Integration is liberation.",
  "What are you avoiding that quietly rules your decisions?",
  "The parts you silence may hold the keys to your deepest gifts.",
  "Your shadow isn’t evil—it’s exiled. Bring it home to the light of awareness.",
  "Perfection is a mask. Let it fall so truth can breathe.",
  "You are not broken. Your shadow is a protector forged in pain.",
  "Self-sabotage is often self-protection. Look deeper with compassion.",
  "Your discomfort is sacred data. Don’t numb it—decode it.",
  "What are you hiding to be accepted? Your shadow holds that cost.",
  "Your pain is valid. But it does not have to be your identity.",
  "Healing begins the moment you stop pretending everything’s fine."
];

const shadowMemory = new Map();

async function getShadowMessage(userId) {
  if (!shadowMemory.has(userId)) {
    const index = Math.floor(Math.random() * presetShadows.length);
    shadowMemory.set(userId, true);
    return `🌑 Shadow Message\n\n${presetShadows[index]}`;
  } else {
    const prompt = "Speak from the shadow side of the psyche. Provide a spiritual but confronting insight that reveals what the user must face within themselves in order to heal or evolve.";
    const reply = await getDeepseekReply(prompt);
    return `🌑 Shadow Message\n\n${reply}`;
  }
}

module.exports = { getShadowMessage };
