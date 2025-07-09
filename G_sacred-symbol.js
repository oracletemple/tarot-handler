// G_sacred-symbol.js - v1.1.1
const axios = require("axios");

// ✅ 预设象征性灵性符号解读（首次点击用）
const presetSymbolMessages = [
  "🕸 *Spider Web*: You are weaving a destiny of subtle strength. Trust the invisible connections you’re building.",
  "🔺 *Triangle*: A symbol of harmony between body, mind, and spirit. Align your intentions in all dimensions.",
  "🌕 *Full Moon*: Illumination is upon you. What was once hidden now comes into light.",
  "🌀 *Spiral*: You are evolving, not repeating. Each cycle brings you closer to your essence.",
  "🗝 *Ancient Key*: You hold access to deeper truths. Are you ready to unlock the doors within?",
  "🕊 *White Dove*: Peace seeks you. Release conflict and rise into calm clarity.",
  "🌈 *Rainbow*: A bridge between realms. Something magical is aligning in your favor.",
  "🔥 *Flame*: Your inner fire calls for expression. Let passion guide your next step.",
  "🪞 *Mirror*: Life is reflecting your inner state. What truth are you being asked to face?",
  "💠 *Sacred Geometry*: Order exists within chaos. Seek the divine pattern beneath the noise.",
  "🌙 *Crescent Moon*: A time of inner growth. What begins now will blossom in silence.",
  "🧬 *DNA Helix*: You carry ancient wisdom within your being. Trust your inherited light.",
  "🔮 *Crystal Sphere*: Clarity is coming. Be still and watch what takes shape.",
  "⚖️ *Scales*: Balance is your medicine. What needs release to restore equilibrium?",
  "🗿 *Stone Totem*: You are protected by ancestral strength. Stand tall in your path.",
  "🦋 *Butterfly*: You are in transformation. Don’t fear the shedding—wings are forming.",
  "🪶 *Feather*: A message from spirit is near. Listen to what cannot be spoken aloud.",
  "🌊 *Wave*: Emotions are sacred messengers. Flow with them, not against.",
  "💎 *Diamond*: Pressure has shaped your brilliance. Shine without apology.",
  "🌿 *Vine*: You are connected, supported, and growing—even in tangled moments.",
  "🕯 *Candle Flame*: You are a beacon in the dark. Let your presence be enough."
];

const usedApiSet = new Set();

// ✅ 主导出函数：统一命名为 getSymbolInsight
async function getSymbolInsight(userId) {
  if (!usedApiSet.has(userId)) {
    usedApiSet.add(userId);
    const random = Math.floor(Math.random() * presetSymbolMessages.length);
    return presetSymbolMessages[random];
  } else {
    return await callDeepSeekSymbol();
  }
}

// ✅ DeepSeek 灵性符号回应（第二次起）
async function callDeepSeekSymbol() {
  const apiKey = "sk-cf17088ece0a4bc985dec1464cf504e1";
  const prompt = `Offer a mystical interpretation of a sacred symbol revealed to the user today. The message should feel personal, poetic, and spiritually symbolic, guiding the user with metaphor and intuition.`;

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
    console.error("DeepSeek API error (sacred symbol):", err.message);
    return "⚠️ The sacred symbol is not clear right now. Try again later when the signs return.";
  }
}

module.exports = { getSymbolInsight };
