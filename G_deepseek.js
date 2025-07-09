// G_deepseek.js - v1.0.0

const axios = require("axios");

const API_KEY = "sk-cf17088ece0a4bc985dec1464cf504e1"; // 默认 DeepSeek Key
const API_URL = "https://api.deepseek.com/v1/chat/completions";

async function getDeepseekReply(prompt) {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are a wise and mystical spiritual guide. Respond with insightful, symbolic, and emotionally resonant language, suitable for a professional tarot reading or soul guidance session. Keep your tone profound yet comforting.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.9,
        top_p: 0.95,
        max_tokens: 400,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const result = response.data?.choices?.[0]?.message?.content;
    return result || "⚠️ The spiritual winds are unclear. Please try again later.";
  } catch (err) {
    console.error("DeepSeek API error:", err.message);
    return "⚠️ The spiritual winds are unclear. Please try again later.";
  }
}

module.exports = { getDeepseekReply };
