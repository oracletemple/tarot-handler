// G_deepseek.js - v1.0.0
const axios = require('axios');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-cf17088ece0a4bc985dec1464cf504e1';

async function callDeepSeek(promptText) {
  const url = 'https://api.deepseek.com/v1/chat/completions';
  const payload = {
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: 'You are a mystical oracle. Speak in elegant, poetic English with spiritual insight.'
      },
      {
        role: 'user',
        content: promptText
      }
    ]
  };

  const headers = {
    Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.post(url, payload, { headers });
    return response.data.choices[0].message.content;
  } catch (err) {
    console.error('[DeepSeek API Error]', err?.response?.data || err.message);
    return '⚠️ Failed to get spiritual response.';
  }
}

module.exports = { callDeepSeek };
