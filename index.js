// v1.0.11 - 主入口，处理 webhook 与按钮模拟点击
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { sendMessage } = require('./utils/telegram');
const { getCardImage, getCardName } = require('./utils/tarot');
const { startSession, getCard, isSessionComplete } = require('./utils/tarot-session');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const body = req.body;
  if (body.callback_query) {
    const { id, data, message, from } = body.callback_query;
    const userId = from.id;
    const cardIndex = parseInt(data.split('_')[1]);

    const cardNumber = getCard(userId, cardIndex);
    if (!cardNumber) {
      return res.sendStatus(200);
    }

    const image = getCardImage(cardNumber);
    const name = getCardName(cardNumber);
    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`, {
      chat_id: userId,
      photo: image,
      caption: `🃏 You drew: *${name}*`,
      parse_mode: 'Markdown',
    });

    res.sendStatus(200);
  } else if (body.message) {
    const { chat, text } = body.message;
    if (text.startsWith('/start')) {
      await sendMessage(chat.id, '🔮 Welcome to Tarot Oracle!');
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(200);
  }
});

app.post('/simulate-click', async (req, res) => {
  const { userId, messageId, index } = req.body;
  try {
    await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/answerCallbackQuery`, {
      callback_query_id: 'simulate',
    });

    await axios.post(`https://tarot-handler.onrender.com/webhook`, {
      callback_query: {
        id: 'simulate',
        from: { id: userId },
        message: { message_id: messageId },
        data: `card_${index}`,
      },
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('[ERROR] simulateClick failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('🚀 Tarot Webhook Server running at http://localhost:3000');
});
