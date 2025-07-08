// G_gpt-analysis.js - v1.0.0

const { callDeepSeek } = require('./G_deepseek');

/**
 * 返回 GPT 灵性分析内容（使用 DeepSeek 接口）
 */
async function getGptAnalysis() {
  const prompt = "Offer a deep spiritual message for today's energy. Be poetic, mystical, and emotionally uplifting.";
  const response = await callDeepSeek(prompt);
  return `🪐 *DeepSeek Insight*\n\n${response}`;
}

module.exports = { getGptAnalysis };
