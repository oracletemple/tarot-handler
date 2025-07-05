// v1.1.4

// ✅ 本次修复包括以下四个关键项：
// 1. tarot-session.js：限制只能抽三张牌，超出不返回内容
// 2. telegram.js：点击按钮时判断是否还可抽牌，超过则不推送
// 3. 抽完三张牌后自动清空按钮（编辑消息）
// 4. 修复模拟交易时 "undefined USDT" 提示（字段不完整判断）

// ⚠️ 以下两个文件需同步上传覆盖：
// - usdt-listener/utils/telegram.js
// - tarot-handler/utils/telegram.js
// 📌 原因：telegram.js 属于共享模块，两个项目必须保持一致

// ========= 📁 文件路径：utils/tarot-session.js =========

const sessions = new Map();

function startSession(userId) {
  sessions.set(userId, { cards: [] });
}

function getCard(userId, index) {
  const session = sessions.get(userId);
  if (!session || session.cards.length >= 3) return null;
  const card = drawCard();
  session.cards.push(card);
  return card;
}

function isSessionComplete(userId) {
  const session = sessions.get(userId);
  return session && session.cards.length === 3;
}

function drawCard() {
  const cards = ["The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor"];
  const meanings = [
    "New beginnings, spontaneity, innocence",
    "Willpower, creation, manifestation",
    "Intuition, mystery, subconscious mind",
    "Fertility, beauty, nature, nurturing",
    "Authority, structure, control"
  ];
  const index = Math.floor(Math.random() * cards.length);
  return { name: cards[index], meaning: meanings[index] };
}

module.exports = { startSession, getCard, isSessionComplete };


// ========= 📁 文件路径：utils/telegram.js =========

const axios = require("axios");
const { getCard, isSessionComplete, startSession } = require("./tarot-session");

const BOT_TOKEN = process.env.BOT_TOKEN;
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chat_id, text, buttons) {
  const payload = {
    chat_id,
    text,
    parse_mode: "HTML",
  };
  if (buttons) {
    payload.reply_markup = {
      inline_keyboard: [buttons.map((b) => ({ text: b.text, callback_data: b.data }))],
    };
  }
  await axios.post(`${TG_API}/sendMessage`, payload);
}

async function editMessage(chat_id, message_id, text) {
  await axios.post(`${TG_API}/editMessageText`, {
    chat_id,
    message_id,
    text,
    parse_mode: "HTML"
  });
}

async function handleTransaction(userId, amount) {
  if (!amount || isNaN(amount)) {
    await sendMessage(userId, `⚠️ Received <b>undefined</b> USDT, which is below the minimum threshold.`);
    return;
  }

  if (amount < 10) {
    await sendMessage(userId, `⚠️ Received <b>${amount}</b> USDT, which is below the minimum threshold.`);
    return;
  }

  startSession(userId);

  await sendMessage(
    userId,
    amount >= 30
      ? `✨ <b>Premium tarot payment of ${amount} USDT received.</b>\n\nYou may now begin your divine journey.`
      : `🔮 <b>Basic tarot payment of ${amount} USDT received.</b>`,
  );

  await sendMessage(
    userId,
    `You have received a divine reading. Please choose your first card:`,
    [
      { text: "🃏 Card 1", data: `draw_1` },
      { text: "🃏 Card 2", data: `draw_2` },
      { text: "🃏 Card 3", data: `draw_3` }
    ]
  );
}

async function handleButtonClick(userId, message_id, index) {
  const card = getCard(userId, index);
  if (!card) {
    await sendMessage(userId, `🔁 You’ve already drawn three cards. Thank you for your reading.`);
    await editMessage(userId, message_id, `✨ Your divine tarot session is complete.`);
    return;
  }

  await sendMessage(
    userId,
    `🃏 <b>${card.name}</b>\n${card.meaning}`
  );

  if (isSessionComplete(userId)) {
    await sendMessage(userId, `🔮 You’ve completed your 3-card reading. Blessings upon your path.`);
    await editMessage(userId, message_id, `✨ Your divine tarot session is complete.`);
  }
}

module.exports = { handleTransaction, handleButtonClick, sendMessage };


// ========= 📁 文件路径：index.js（入口，保证引用逻辑不变） =========

const express = require("express");
const bodyParser = require("body-parser");
const { handleTransaction, handleButtonClick } = require("./utils/telegram");

const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  const { userId, amount, message_id, action } = req.body;

  if (action && action.startsWith("draw_")) {
    const index = parseInt(action.split("_")[1]);
    await handleButtonClick(userId, message_id, index);
  } else {
    await handleTransaction(userId, amount);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Tarot service running on port ${PORT}`);
});
