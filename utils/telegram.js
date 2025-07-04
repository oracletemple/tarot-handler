// v1.0.11 - Telegram 工具封装
const axios = require('axios');
const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text, buttons) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
  };

  if (buttons) {
    payload.reply_markup = {
      inline_keyboard: [buttons],
    };
  }

  try {
    const res = await axios.post(`${TELEGRAM_API}/sendMessage`, payload);
    return res.data;
  } catch (err) {
    console.error('[ERROR] Telegram sendMessage failed:', err.message);
  }
}

async function editMessage(chatId, messageId, text) {
  try {
    await axios.post(`${TELEGRAM_API}/editMessageText`, {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'Markdown',
    });
  } catch (err) {
    console.error('[ERROR] Telegram editMessage failed:', err.message);
  }
}

module.exports = {
  sendMessage,
  editMessage,
};
