// B_telegram.js - v1.3.0

const axios = require("axios");
const { getCardInfo } = require("./G_tarot");
const { isSessionComplete } = require("./G_tarot-session");
const { getSpiritGuideMessage } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");

const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * 渲染塔罗牌抽牌按钮
 */
function buildCardButtons(drawn) {
  const buttons = [];

  for (let i = 0; i < 3; i++) {
    if (!drawn.includes(i)) {
      buttons.push([{ text: `🃏 Card ${i + 1}`, callback_data: `card_${i}` }]);
    }
  }

  return {
    inline_keyboard: buttons
  };
}

/**
 * 推送按钮选择消息
 */
async function sendCardButtons(chatId, amount) {
  const drawn = [];
  const reply_markup = buildCardButtons(drawn);

  const text =
    amount >= 30
      ? `✨ *Welcome to the Divine Reading*\nClick each card to reveal your custom Tarot insights.`
      : `✨ *Tap each card to reveal your 3-card Tarot reading*\n(Past / Present / Future)`;

  const res = await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
    reply_markup
  });

  return res.data.result.message_id;
}

/**
 * 编辑按钮（用于抽牌后更新）
 */
async function editInlineKeyboard(chatId, messageId, reply_markup) {
  await axios.post(`${TELEGRAM_API}/editMessageReplyMarkup`, {
    chat_id: chatId,
    message_id: messageId,
    reply_markup
  });
}

/**
 * 回复抽到的牌
 */
async function sendCard(chatId, card, index) {
  const positionMap = ["🌒 *Past*", "🌕 *Present*", "🌘 *Future*"];
  const header = positionMap[index] || "🃏 Your Card";

  let text = `${header}\n*${card.title}*\n${card.meaning}`;

  await axios.post(`${TELEGRAM_API}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: "Markdown"
  });

  if (card.image) {
    await axios.post(`${TELEGRAM_API}/sendPhoto`, {
      chat_id: chatId,
      photo: card.image
    });
  }
}

/**
 * 回复灵性附加内容
 */
async function sendSpiritualExtras(chatId) {
  const spirit = getSpiritGuideMessage();
  const lucky = getLuckyHints();
  const moon = getMoonAdvice();

  const blocks = [spirit, lucky, moon];

  for (const text of blocks) {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "Markdown"
    });
  }
}

/**
 * 处理按钮回调
 */
async function handleCallback(query) {
  const callbackId = query.id;
  const userId = query.from.id;
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;

  const data = query.data;
  const match = data.match(/^card_(\d)$/);

  if (!match) return;

  const index = parseInt(match[1], 10);

  try {
    const card = getCardInfo(userId, index);
    if (!card) throw new Error("No card found");

    await sendCard(chatId, card, index);

    const session = require("./G_tarot-session").getSession(userId);
    const newMarkup = buildCardButtons(session.drawn);
    await editInlineKeyboard(chatId, messageId, newMarkup);

    if (isSessionComplete(userId)) {
      await editInlineKeyboard(chatId, messageId, null); // ✅ 修复：清除按钮
      await sendSpiritualExtras(chatId); // ✅ 推送灵性内容
    }
  } catch (err) {
    await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, {
      callback_query_id: callbackId,
      text: "⚠️ Something went wrong. Please try again.",
      show_alert: true
    });
  }
}

module.exports = {
  sendCardButtons,
  handleCallback
};
