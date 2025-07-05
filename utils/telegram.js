// utils/telegram.js
// v1.1.9 修复 callback userId 与 session 不一致的问题 + 按钮动态减少
const axios = require("axios");

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;
const AMOUNT_THRESHOLD = parseFloat(process.env.AMOUNT_THRESHOLD || "10");

const { getCard, isSessionComplete, startSession } = require("./tarot-session");

function sendMessage(chat_id, text, buttons = null) {
  const payload = {
    chat_id,
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
  const { amount } = tx;
  const tier = amount >= 30 ? "premium" : amount >= 12 ? "basic" : "below";

  if (tier === "below") {
    await sendMessage(process.env.RECEIVER_ID, `⚠️ Received ${amount || "undefined"} USDT, which is below the minimum threshold.`);
    return;
  }

  await startSession(process.env.RECEIVER_ID);

  const intro = tier === "premium"
    ? "🌟 Premium tarot payment of 30 USDT received."
    : "🔮 Basic tarot payment of 12 USDT received.";

  await sendMessage(process.env.RECEIVER_ID, intro);
  await sendMessage(process.env.RECEIVER_ID, "You have received a divine reading. Please choose your first card:", [
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

  await sendMessage(userId, `✨ Your card ${index}: ${card}`);

  const buttons = [];
  for (let i = 1; i <= 3; i++) {
    const drawn = await getCard(userId, i);
    if (!drawn) {
      buttons.push({ text: `🃏 Card ${i}`, callback_data: `draw_${i}` });
    }
  }

  await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
    chat_id: userId,
    message_id: messageId,
    reply_markup: buttons.length > 0 ? { inline_keyboard: [buttons] } : { inline_keyboard: [] }
  });
}

module.exports = {
  handleTransaction,
  handleCallbackQuery,
};
