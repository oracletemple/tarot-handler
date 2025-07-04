// 📁 文件1：utils/telegram.js
// ✅ 上传至：GitHub 仓库 tarot-handler 的 /utils/ 目录下

const axios = require('axios');
const { getCardMeaning } = require('./tarot');
const { getSession, updateSession } = require('./tarot-session');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

// 通用发送消息
async function sendMessage(chatId, text, buttons = null) {
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
    await axios.post(`${TELEGRAM_API}/sendMessage`, payload);
  } catch (err) {
    console.error('[ERROR] Failed to send Telegram message:', err.message);
  }
}

// 👉 处理按钮点击
async function handleDrawCard(req, res) {
  const callback = req.body.callback_query;
  const userId = callback.from.id;
  const messageId = callback.message.message_id;
  const data = callback.data; // 如 draw_1, draw_2, draw_3

  const session = getSession(userId);
  if (!session) return res.sendStatus(200);

  const cardIndex = parseInt(data.split('_')[1], 10);
  const card = session.cards[cardIndex - 1];
  const title = ['Past', 'Present', 'Future'][cardIndex - 1];

  const text = `🃏 *${title}* – ${card.name}\n${getCardMeaning(card.name)}`;
  await sendMessage(userId, text);

  session.revealed.push(cardIndex);
  updateSession(userId, session);

  // ✅ 可选：更新按钮 UI（隐藏已点击按钮）
  res.sendStatus(200);
}

module.exports = {
  sendMessage,
  handleDrawCard,
};
