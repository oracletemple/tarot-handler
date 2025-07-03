const axios = require('axios');
const { generateThreeCardReading } = require('./tarot');
const { updateSession, getSession } = require('./tarot-session');

const token = process.env.BOT_TOKEN;
const apiUrl = `https://api.telegram.org/bot${token}`;

async function sendMessage(chatId, text, buttons) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
  };

  if (buttons) {
    payload.reply_markup = {
      inline_keyboard: [buttons.map(btn => ({
        text: btn.label,
        callback_data: btn.data,
      }))]
    };
  }

  try {
    await axios.post(`${apiUrl}/sendMessage`, payload);
    console.log(`[INFO] Message sent to ${chatId}`);
  } catch (err) {
    console.error('[ERROR] Failed to send Telegram message:', err.message);
  }
}

async function handleDrawCard(req, res) {
  const callback = req.body.callback_query;
  if (!callback) return res.sendStatus(200);

  const chatId = callback.message.chat.id;
  const action = callback.data;

  const cardIndex = {
    draw_card_1: 0,
    draw_card_2: 1,
    draw_card_3: 2
  }[action];

  if (cardIndex === undefined) return res.sendStatus(200);

  const currentSession = getSession(chatId);
  if (!currentSession || currentSession.drawn[cardIndex]) return res.sendStatus(200);

  const card = currentSession.cards[cardIndex];
  updateSession(chatId, cardIndex);

  const cardText = `🃏 *${['Past', 'Present', 'Future'][cardIndex]}* – ${card.name}\n_${card.keywords}_\n`;

  await sendMessage(chatId, cardText);
  res.sendStatus(200);
}

module.exports = {
  sendMessage,
  handleDrawCard
};
