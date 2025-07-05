// v1.1.9
const axios = require("axios");
const {
  getCard,
  isSessionComplete,
  startSession,
} = require("./tarot-session");

const BOT_TOKEN = process.env.BOT_TOKEN;
const RECEIVER_ID = process.env.RECEIVER_ID;
const AMOUNT_THRESHOLD = parseFloat(process.env.AMOUNT_THRESHOLD || "10");

const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text, buttons) {
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
  };
  if (buttons) {
    payload.reply_markup = {
      inline_keyboard: [buttons.map((label, i) => ({
        text: label,
        callback_data: `card_${i + 1}`,
      }))],
    };
  }
  await axios.post(`${apiUrl}/sendMessage`, payload);
}

async function handleTransaction(data) {
  const { amount, sender } = data;
  const chatId = RECEIVER_ID;

  if (!amount || isNaN(amount)) {
    await sendMessage(chatId, `⚠️ Received *undefined USDT*, which is below the minimum threshold.`);
    return;
  }

  if (amount >= 30) {
    await sendMessage(chatId, `✨ *Custom GPT Reading of 30 USDT received.*\nYou will receive an extended interpretation shortly.`);
    await sendMessage(chatId, `🔮 Also including your 12 USDT tarot session below:`); // 包含基础卡牌互动
  }

  if (amount >= AMOUNT_THRESHOLD) {
    await sendMessage(chatId, `🔮 *Basic tarot payment of ${amount} USDT received.*`);
    await startSession(chatId); // 初始化用户 session
    await sendMessage(chatId, `You have received a divine reading. Please choose your first card:`, [
      "🃏 Card 1", "🃏 Card 2", "🃏 Card 3",
    ]);
  } else {
    await sendMessage(chatId, `⚠️ Received *${amount} USDT*, which is below the minimum threshold.`);
  }
}

async function handleCallbackQuery(query) {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  const match = data.match(/^card_(\d)$/);
  if (!match) return;

  const index = parseInt(match[1], 10) - 1;
  const card = getCard(chatId, index);

  await axios.post(`${apiUrl}/sendMessage`, {
    chat_id: chatId,
    text: `✨ *Your Card ${index + 1}:* ${card.meaning}`,
    parse_mode: "Markdown",
  });

  if (isSessionComplete(chatId)) {
    // 删除原按钮消息
    await axios.post(`${apiUrl}/editMessageReplyMarkup`, {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: { inline_keyboard: [] },
    });
  }
}

module.exports = { handleTransaction, handleCallbackQuery };
