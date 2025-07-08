// B_telegram.js - v1.2.7

const { getSession, getCard, isSessionComplete } = require("./G_tarot-session");
const { getCardMeaning } = require("./G_tarot-engine");
const { getSpiritGuide } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-message");
const { renderCardButtons } = require("./G_button-render");
const axios = require("axios");

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;

async function handleTelegramUpdate(update) {
  // 👉 仅处理按钮点击
  if (!update.callback_query) return;

  const callback = update.callback_query;
  const userId = callback.from.id;
  const data = callback.data;
  const messageId = callback.message.message_id;

  // 👉 只处理 card_ 开头的按钮
  if (!data.startsWith("card_")) return;

  const parts = data.split("_");
  const index = parseInt(parts[1], 10);
  const amount = parseInt(parts[2], 10);

  try {
    const session = getSession(userId);
    if (!session) return await sendText(userId, `⚠️ Session not found. Please try again later.`);
    if (session.amount !== amount) return await sendText(userId, `⚠️ Invalid session amount.`);
    if (session.drawn.includes(index)) return await sendText(userId, `⚠️ You have already drawn this card.`);

    // 获取塔罗牌并标记为已抽
    const card = getCard(userId, index);
    const meaning = getCardMeaning(card);
    const positions = ["Past", "Present", "Future"];
    const positionLabel = positions[index] || "Card";
    const reply = `✨ *${positionLabel}*
${meaning}`;

    // 回复牌意
    await sendText(userId, reply);

    // 更新按钮（隐藏已抽牌）
    const newButtons = renderCardButtons(userId);
    await updateInlineButtons(userId, messageId, newButtons);

    // 若已抽满三张牌，推送三个灵性模块
    if (isSessionComplete(userId)) {
      const spirit = getSpiritGuide();
      const lucky = getLuckyHints();
      const moon = getMoonAdvice();

      await sendText(userId, `🧚 *Your Spirit Guide*
${spirit}`);
      await sendText(userId, `🎨 *Today's Lucky Signs*
${lucky}`);
      await sendText(userId, `${moon}`);
    }
  } catch (err) {
    console.error("❌ handleTelegramUpdate error:", err);
    await sendText(userId, `❌ Error: ${err.message}`);
  }
}

async function sendText(chatId, text) {
  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: "Markdown"
  });
}

async function updateInlineButtons(chatId, messageId, buttons) {
  await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: { inline_keyboard: buttons }
  });
}

module.exports = { handleTelegramUpdate };
