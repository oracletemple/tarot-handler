const axios = require('axios');
const { getTarotCard } = require('./tarot');
const { sessionStore } = require('./tarot-session');

const token = process.env.TELEGRAM_BOT_TOKEN;
const telegramAPI = `https://api.telegram.org/bot${token}`;

// 发送普通文本消息
async function sendMessage(chatId, text, replyMarkup = null) {
  await axios.post(`${telegramAPI}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: 'Markdown',
    ...(replyMarkup && { reply_markup: replyMarkup }),
  });
}

// 发送塔罗抽牌按钮
async function sendTarotButtons(chatId) {
  sessionStore[chatId] = { drawn: [] };

  const replyMarkup = {
    inline_keyboard: [[
      { text: 'Draw First Card', callback_data: 'draw_1' },
      { text: 'Draw Second Card', callback_data: 'draw_2' },
      { text: 'Draw Third Card', callback_data: 'draw_3' },
    ]]
  };

  await sendMessage(chatId,
    `🧿 Please focus your energy and draw 3 cards...\n\n👇 Tap the buttons to reveal your Tarot Reading:`,
    replyMarkup
  );
}

// 处理用户点击的抽牌按钮
async function handleDrawCard(chatId, data) {
  if (!sessionStore[chatId]) {
    sessionStore[chatId] = { drawn: [] };
  }

  const drawn = sessionStore[chatId].drawn;

  const position = {
    'draw_1': 'Past',
    'draw_2': 'Present',
    'draw_3': 'Future'
  }[data];

  if (!position || drawn.includes(position)) return;

  const card = getTarotCard();
  drawn.push(position);

  await sendMessage(chatId, `🃏 *${position}* — ${card.name}\n_${card.meaning}_`, null);

  if (drawn.length === 3) {
    await sendMessage(chatId, `✨ Your divine message is complete. Trust the path ahead.`);
    delete sessionStore[chatId];
  }
}

module.exports = { sendMessage, sendTarotButtons, handleDrawCard };
