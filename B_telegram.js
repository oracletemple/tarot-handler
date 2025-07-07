// B_telegram.js - v1.2.7

const axios = require("axios");
const { getSession, getCard, isSessionComplete } = require("./G_tarot-session");
const { renderRemainingButtons } = require("./G_button-render");
const { sendSpiritualAddons } = require("./G_spiritual-addons");

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

/**
 * 处理 Telegram 回调按钮逻辑
 */
async function handleCallback(callback) {
  const userId = callback.from.id;
  const messageId = callback.message.message_id;
  const chatId = callback.message.chat.id;
  const data = callback.data;

  // 匹配格式 card_0_12 / card_2_30 等
  const match = data.match(/^card_(\d)_(\d{2})$/);
  if (!match) return;

  const cardIndex = parseInt(match[1], 10);
  const amount = parseInt(match[2], 10);

  try {
    const session = getSession(userId);
    if (!session) {
      await sendMessage(chatId, "⚠️ Session not found. Please try again later.");
      return;
    }

    if (session.drawn.includes(cardIndex)) {
      await sendMessage(chatId, "⚠️ You've already drawn this card.");
      return;
    }

    // 获取当前抽到的牌
    const card = getCard(userId, cardIndex);

    // 推送该卡片内容
    const position = ["Past", "Present", "Future"][cardIndex] || "Card";
    const imageUrl = card.image || null;
    const meaning = card.meaning || "🔮 Mysterious forces surround this card...";

    let text = `✨ <b>${position}</b> Card\n<b>${card.name}</b>\n${meaning}`;
    await sendPhotoOrText(chatId, text, imageUrl);

    // 更新按钮，仅保留未抽卡
    await editReplyMarkup(chatId, messageId, renderRemainingButtons(session.drawn, amount));

    // 如果三张已抽完，自动推送附加灵性内容
    if (isSessionComplete(userId)) {
      await sendSpiritualAddons(chatId);
    }

  } catch (err) {
    console.error("❌ Callback error:", err.message);
    await sendMessage(chatId, "⚠️ Error occurred while processing your card. Please try again.");
  }
}

// ========= 基础发送函数 ========= //

async function sendMessage(chatId, text) {
  await axios.post(`${API_URL}/sendMessage`, {
    chat_id: chatId,
    text,
    parse_mode: "HTML"
  });
}

async function sendPhotoOrText(chatId, text, imageUrl = null) {
  if (imageUrl) {
    await axios.post(`${API_URL}/sendPhoto`, {
      chat_id: chatId,
      photo: imageUrl,
      caption: text,
      parse_mode: "HTML"
    });
  } else {
    await sendMessage(chatId, text);
  }
}

async function editReplyMarkup(chatId, messageId, replyMarkup) {
  await axios.post(`${API_URL}/editMessageReplyMarkup`, {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: replyMarkup
  });
}

module.exports = { handleCallback };
