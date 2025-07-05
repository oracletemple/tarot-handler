// v1.0.11
const { getCard, isSessionComplete } = require('./tarot-session');
const { sendMessage } = require('./telegram');

async function handleDrawCard(userId, index) {
  const card = getCard(userId, index);
  if (!card) {
    return sendMessage(userId, `❗️Card ${index + 1} has already been drawn or session not found.`);
  }

  const message = `🔮 *Card ${index + 1}:* ${card}`;
  await sendMessage(userId, message);

  if (isSessionComplete(userId)) {
    await sendMessage(userId, `✨ Your 3-card reading is complete. Thank you for your energy.`);
  }
}

module.exports = {
  handleDrawCard,
};
