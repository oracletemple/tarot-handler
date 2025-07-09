// G_pastlife.js - v1.1.0
const axios = require("axios");

const presetMessages = [
  "🧿 *You once stood at the gates of an ancient temple*, cloaked in midnight blue, whispering invocations to forgotten gods. Your soul still remembers the stillness between each sacred word.",
  "🧿 *In a lifetime long past, you walked the deserts alone*, seeking silence not as absence, but as a bridge to the divine. Your footsteps echo still in moments of deep meditation.",
  "🧿 *You were once a healer by moonlight*, mixing herbs with hymns, your fingers guided by unseen forces. This gift lingers in your intuition and compassion.",
  "🧿 *You lived as a scribe in a marble city*, transcribing secrets of the stars into ancient scrolls. Now, you write truths in quiet moments, even if no ink is involved.",
  "🧿 *You danced in firelit circles beneath the solstice moon*, every movement a prayer, every breath a surrender. The rhythm lives on in your heartbeat.",
  "🧿 *In the highlands, you spoke to the wind as kin*, hearing its secrets and offering your own. The wind still finds you when you're still enough to listen.",
  "🧿 *You wore the robes of silent orders*, vows unspoken but etched into your essence. This inner discipline anchors you in storms.",
  "🧿 *As an artisan of sacred symbols*, your hands carved meaning into matter. Now, even your casual doodles carry energy.",
  "🧿 *You knew exile*, and through it, the truth that belonging is not a place, but a remembrance of soul. You recognize other wanderers instantly.",
  "🧿 *You were once the keeper of wells*, tending to underground waters as sacred veins of the Earth. Hydration still feels like communion to you.",
  "🧿 *You passed through the veil young once*, not by accident, but initiation. You've returned now with echoes of realms most forget.",
  "🧿 *In candlelit chambers, you interpreted dreams*, not with books but breath. Now, your own dreams carry layered voices and veiled guidance.",
  "🧿 *You lived as a forest dweller*, antler-crowned, moss-veined, speaking fluently in the dialect of roots. Nature still bends near you.",
  "🧿 *You studied death not to conquer it*, but to cradle its silence. You now comfort others in ways they can’t quite name.",
  "🧿 *You stood watch at the cosmic border*, a guardian of soul passages. You still feel restless when celestial events stir.",
  "🧿 *You crafted amulets from bone and light*, each piece encoded with blessings. Your touch still weaves invisible protection.",
  "🧿 *You hid truths in melodies*, composing hymns that awakened sleeping hearts. Music still moves you more than reason.",
  "🧿 *You wandered the ice-bound tundras*, not seeking warmth but vision. Cold air still awakens your ancient clarity.",
  "🧿 *You were blind in one life, but saw more than most.* Your inner sight now guides you past illusion.",
  "🧿 *You sang to stars before telescopes*, sensing their rhythm with your cells. You still look up and feel called home.",
  "🧿 *You broke cycles once*, not for yourself, but for generations to come. You're still breaking them now—with greater awareness."
];

const usedSet = new Set(); // 控制避免重复
const apiUsed = new Set(); // 用户调用记录

async function getPastLifeEcho(userId) {
  if (!apiUsed.has(userId)) {
    apiUsed.add(userId);
    const unused = presetMessages.filter(msg => !usedSet.has(msg));
    const message = unused.length > 0
      ? unused[Math.floor(Math.random() * unused.length)]
      : presetMessages[Math.floor(Math.random() * presetMessages.length)];
    usedSet.add(message);
    return message;
  } else {
    return await callDeepSeekPastlife();
  }
}

async function callDeepSeekPastlife() {
  const apiKey = "sk-cf17088ece0a4bc985dec1464cf504e1";
  const prompt = `Offer a symbolic and poetic vision of the user's past life. Use spiritual, mysterious language, filled with emotional resonance.`;

  try {
    const res = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a mystical oracle who channels symbolic past life visions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.9
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    return `🧿 *Past Life Echo*\n\n${res.data.choices[0].message.content.trim()}`;
  } catch (err) {
    console.error("DeepSeek API error (pastlife):", err.message);
    return "🧿 *Past Life Echo*\n\nSomething ancient stirs but remains veiled. Try again later.";
  }
}

module.exports = { getPastLifeEcho };
