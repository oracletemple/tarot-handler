// G_gpt-analysis.js - v1.1.0
const { callDeepSeek } = require('./G_deepseek');

/**
 * 🧠 获取 GPT 灵性分析内容（调用 DeepSeek API）
 * 返回一段带有诗意、灵性、情感鼓舞的分析信息
 */
async function getGptAnalysis() {
  const prompt = `Offer a deep, emotionally resonant spiritual analysis for today's energy.
Use poetic language, intuitive metaphors, and uplifting tones.
Let the user feel seen, guided, and gently empowered.`;
  
  const response = await callDeepSeek(prompt);
  return `🪐 *DeepSeek Insight*\n\n${response}`;
}

module.exports = { getGptAnalysis };
