// G_spirit-message.js - v1.1.1
const axios = require("axios");

// ✅ 第一次点击使用：灵性指引短语（预设 21 段）
const presetSpiritMessages = [
  "🌬 *A whisper rides the wind:* 'You're not lost—you’re being redirected with divine precision.'",
  "🌠 *From the stars above:* 'What you fear is often the threshold of your transformation.'",
  "🕯 *The silence speaks:* 'Even in stillness, your soul is moving.'",
  "📜 *A message unfolds:* 'Your story is sacred—do not rush its pages.'",
  "🌊 *From the tide:* 'Release control, and watch your path unfold with grace.'",
  "🦉 *An ancient voice echoes:* 'Wisdom doesn’t arrive loudly—it waits for your listening.'",
  "💫 *In the quiet:* 'You are already held. Nothing is truly missing.'",
  "🪶 *Spirit drifts in:* 'Let your truth be soft and still powerful.'",
  "🌌 *From the beyond:* 'What you sense but cannot name is real—trust your subtle knowing.'",
  "🧭 *Guided gently:* 'The light is not always ahead—sometimes, it’s within.'",
  "🌺 *From the petals of the unseen:* 'Surrender isn’t weakness, it’s alignment.'",
  "🔔 *A call you can’t ignore:* 'It's time to return to what your soul already knows.'",
  "🪄 *Spirit weaves this moment:* 'You are already the magic you seek.'",
  "🫧 *From breath to breath:* 'Your spirit craves presence, not perfection.'",
  "🕊 *A blessing descends:* 'Peace is your inheritance—claim it.'",
  "🌈 *The veil thins:* 'You are seen, held, and guided—even when it feels quiet.'",
  "🗝 *The gate opens:* 'Unlock yourself by releasing the need to prove anything.'",
  "🌙 *Night whispers:* 'Your dreams are instructions—don’t ignore their language.'",
  "🫀 *A voice through your heartbeat:* 'Be where your breath is. Spirit meets you there.'",
  "🪞 *From reflection:* 'You’re not behind. You’re exactly where depth begins.'",
  "🎴 *A divine draw:* 'The message isn’t new—it’s the one you’ve always needed to remember.'"
];

const usedApiSet = new Set();

async function getSpiritMessage(userId) {
  if (!usedApiSet.has(userId)) {
    usedApiSet.add(userId);
    const random = Math.floor(Math.random() * presetSpiritMessages.length);
    return presetSpiritMessages[random];
  } else {
    return await callDeepSeekSpirit();
  }
}

// ✅ 第二次及以后：DeepSeek 灵性回应
async function callDeepSeekSpirit() {
  const apiKey = "sk-cf17088ece0a4bc985dec1464cf504e1";
  const prompt = `Channel a poetic and symbolic message from a spiritual presence or unseen guide. Let the message feel intuitive, mystical, and nurturing, as if whispered to the user at a soul level.`;

  try {
    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("DeepSeek API error (spirit):", err.message);
    return "⚠️ The spirit's message is faint. Try again later when the veil thins once more.";
  }
}

module.exports = { getSpiritMessage };
