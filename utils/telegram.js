// utils/telegram.js
// v1.1.7
const axios = require("axios");

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;
const RECEIVER_ID = process.env.RECEIVER_ID;
const AMOUNT_THRESHOLD = parseFloat(process.env.AMOUNT_THRESHOLD || "10");

const { getCard, isSessionComplete, startSession } = require("./tarot-session");

function sendMessage(text, buttons = null) {
  const payload = {
    chat_id: RECEIVER_ID,
    text,
    parse_mode: "Markdown",
  };

  if (buttons) {
    payload.reply_markup = {
      inline_keyboard: [buttons],
    };
  }

  return axios.post(`${TELEGRAM_API}/sendMessage`, payload);
}

async function handleTransaction(tx) {
  const { amount, hash } = tx;
  const tier = amount >= 30 ? "premium" : amount >= 12 ? "basic" : "below";

  if (tier === "below") {
    await sendMessage(`⚠️ Received ${amount || "undefined"} USDT, which is below the minimum threshold.`);
    return;
  }

  await startSession(RECEIVER_ID);

  if (tier === "basic") {
    await sendMessage("🔮 Basic tarot payment of 12 USDT received.");
  } else if (tier === "premium") {
    await sendMessage("🌟 Premium tarot payment of 30 USDT received.");
  }

  await sendMessage("You have received a divine reading. Please choose your first card:", [
    { text: "🃏 Card 1", callback_data: "draw_1" },
    { text: "🃏 Card 2", callback_data: "draw_2" },
    { text: "🃏 Card 3", callback_data: "draw_3" },
  ]);
}

async function handleCallbackQuery(query) {
  const userId = query.from.id;
  const data = query.data;
  const messageId = query.message.message_id;

  const match = data.match(/^draw_(\d)$/);
  if (!match) return;

  const index = parseInt(match[1]);
  const card = await getCard(userId, index);

  const followUp = await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: userId,
    text: `✨ Your card ${index}: ${card}`,
  });

  // 清除按钮或继续显示未抽完的按钮
  const stillActive = !await isSessionComplete(userId);

  const nextButtons = [];

  if (stillActive) {
    for (let i = 1; i <= 3; i++) {
      const tryCard = await getCard(userId, i);
      if (!tryCard) {
        nextButtons.push({ text: `🃏 Card ${i}`, callback_data: `draw_${i}` });
      }
    }
  }

  await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
    chat_id: userId,
    message_id: messageId,
    reply_markup: stillActive ? { inline_keyboard: [nextButtons] } : { inline_keyboard: [] }
  });
}

module.exports = {
  handleTransaction,
  handleCallbackQuery,
};
