// ✅ telegram.js - v1.2.0
const TelegramBot = require("node-telegram-bot-api");
const { getCard, isSessionComplete, startSession, sessionStore } = require("./tarot-session");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

// ✅ 发送按钮
async function sendCardButtons(userId) {
  await bot.sendMessage(userId, "Please choose your card:", {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🃏 Card 1", callback_data: "card_0" },
          { text: "🃏 Card 2", callback_data: "card_1" },
          { text: "🃏 Card 3", callback_data: "card_2" },
        ],
      ],
    },
  });
}

// ✅ 处理点击与转账
async function handleTransaction({ callback_query, transaction }) {
  if (callback_query) {
    const userId = callback_query.from.id;
    const messageId = callback_query.message.message_id;
    const data = callback_query.data;

    const index = parseInt(data.replace("card_", ""));
    if (isNaN(index)) return;

    const result = await getCard(userId, index);

    if (!result) {
      await bot.sendMessage(userId, "⚠️ Session not found. Please try again later.");
      return;
    }

    await bot.sendMessage(userId, result.text);

    // 如果抽完三张牌，禁用按钮
    if (isSessionComplete(userId)) {
      await bot.editMessageReplyMarkup({
        chat_id: userId,
        message_id: messageId,
        reply_markup: { inline_keyboard: [] },
      });
    }
    return;
  }

  if (transaction) {
    const { amount, to, user_id } = transaction;
    if (to !== process.env.WALLET_ADDRESS) return;
    if (amount < Number(process.env.AMOUNT_THRESHOLD)) return;

    await startSession(user_id);
    await sendCardButtons(user_id);
  }
}

module.exports = {
  bot,
  sendCardButtons,
  handleTransaction,
};
