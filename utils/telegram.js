// v1.0.11
const axios = require('axios');
const { getSession, startSession, getCard } = require('./tarot-session');

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendTarotButtons(userId, hash, isTest = false) {
  const testTag = isTest ? '🧪 TEST MODE\n\n' : '';
  const text = `${testTag}💸 Payment received:\n\n💰 Amount: 12 USDT (TRC20)\n🔗 Tx Hash: ${hash}\n\n🔮 Please focus your energy and draw 3 cards...\n👇 Tap the buttons to reveal your Tarot Reading:`;

  await axios.post(`${API_URL}/sendMessage`, {
    chat_id: userId,
    text,
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔮 Draw Card 1', callback_data: 'draw_0' },
          { text: '🔮 Draw Card 2', callback_data: 'draw_1' },
          { text: '🔮 Draw Card 3', callback_data: 'draw_2' },
        ],
      ],
    },
  });
}

async function sendCustomReading(userId, hash, amount, isTest = false) {
  const testTag = isTest ? '🧪 TEST MODE\n\n' : '';
  const text = `${testTag}💸 Payment received:\n\n💰 Amount: ${amount} USDT (TRC20)\n🔗 Tx Hash: ${hash}\n\n🧠 You have unlocked the Custom Oracle Reading.\nPlease reply with your question – we will begin your spiritual decoding.\n\n🔮 Bonus: You also receive a 3-card Tarot Reading below:`;

  await axios.post(`${API_URL}/sendMessage`, {
    chat_id: userId,
    text,
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔮 Draw Card 1', callback_data: 'draw_0' },
          { text: '🔮 Draw Card 2', callback_data: 'draw_1' },
          { text: '🔮 Draw Card 3', callback_data: 'draw_2' },
        ],
      ],
    },
  });
}

module.exports = {
  sendTarotButtons,
  sendCustomReading,
};
