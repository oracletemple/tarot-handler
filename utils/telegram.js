// v1.1.2
const axios = require('axios');
const { startSession, getCard, isSessionComplete } = require('./tarot-session');

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

async function sendTarotButtons(chatId) {
  startSession(chatId);
  const buttons = [
    [{ text: 'Draw Card 1', callback_data: 'draw_0' }],
    [{ text: 'Draw Card 2', callback_data: 'draw_1' }],
    [{ text: 'Draw Card 3', callback_data: 'draw_2' }]
  ];
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: "🔮 Please focus your energy and draw 3 cards...\n👇 Tap the buttons to reveal your Tarot Reading:",
    reply_markup: { inline_keyboard: buttons }
  });
}

async function handleDrawCard(chatId, index) {
  const card = getCard(chatId, index);
  if (!card) throw new Error("handleDrawCard failed: invalid session or card index");

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: `✨ Card ${index + 1}: ${card}`
  });
}

async function sendCustomReadingPrompt(chatId) {
  const msg = `🧠 You have unlocked the Custom Oracle Reading.\nPlease reply with your question – we will begin your spiritual decoding.\n\n🔮 Bonus: You also receive a 3-card Tarot Reading below:`;
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text: msg
  });
  await sendTarotButtons(chatId);
}

module.exports = {
  sendTarotButtons,
  handleDrawCard,
  sendCustomReadingPrompt
};
