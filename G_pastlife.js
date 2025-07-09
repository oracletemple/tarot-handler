// G_pastlife.js - v1.2.0

const { getDeepseekReply } = require("./G_deepseek");

const presetPastLives = [
  "In a desert temple, you once walked as a keeper of sacred scrolls. Your voice now carries echoes of forgotten truths.",
  "You lived as a healer in a mountain village, drawing strength from herbs and stars. Your hands remember.",
  "Once a nomadic storyteller, your words shaped worlds. The urge to write and speak is a soul memory.",
  "You served as an oracle by the sea. Dreams and tides still whisper guidance to you.",
  "A warrior who laid down arms to seek peace—you now choose inner harmony over conflict.",
  "You tended sacred fire in a moonlit grove. That flame still burns in your heart.",
  "You once guided souls between realms. Your current empathy is a reflection of that wisdom.",
  "A scribe in an ancient city—you now seek truth through reflection and learning.",
  "You lived in silence in a mountain cave. Stillness is still your teacher.",
  "You once forged symbols into stone—now you decode meaning in subtle signs."
];

const pastlifeMemory = new Map();

async function getPastLifeEcho(userId) {
  if (!pastlifeMemory.has(userId)) {
    const index = Math.floor(Math.random() * presetPastLives.length);
    pastlifeMemory.set(userId, true);
    return `🧿 Past Life Echo\n\n${presetPastLives[index]}`;
  } else {
    const prompt = "You are a mystical guide revealing a symbolic past life to the user. Describe it in vivid, poetic, and archetypal terms, and connect it to something meaningful in their current spiritual journey.";
    const reply = await getDeepseekReply(prompt);
    return `🧿 Past Life Echo\n\n${reply}`;
  }
}

module.exports = { getPastLifeEcho };
