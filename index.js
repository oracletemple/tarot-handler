// v1.1.4 - tarot-handler/index.js

const express = require("express");
const bodyParser = require("body-parser");
const { sendMessage } = require("./utils/telegram");
const { startSession, getCard, isSessionComplete } = require("./utils/tarot-session");
const tarotData = require("./data/card-data");

const app = express();
app.use(bodyParser.json());

const RECEIVER_ID = "7685088782";

app.get("/", (req, res) => {
  res.send("Tarot Handler Active");
});

// Telegram Webhook 接口
app.post("/webhook", async (req, res) => {
  const message = req.body.message;
  const callback = req.body.callback_query;

  try {
    // 处理付款推送（监听 usdt-listener）
    if (message && message.text && message.chat) {
      const text = message.text;
      const userId = message.chat.id;

      // 仅接受来自监听器的转发消息
      if (userId.toString() === RECEIVER_ID && text.includes("USDT payment received")) {
        const targetId = extractUserId(text);
        if (targetId) {
          await sendMessage(targetId, `🎉 We've received your payment.\nPlease choose a card below to begin your reading:`);
          await startSession(targetId);
          await sendMessage(targetId, `🃏 Choose your card:\n\n👉 /card1\n👉 /card2\n👉 /card3`);
        }
      }
    }

    // 处理按钮指令
    if (message && message.text && message.chat) {
      const text = message.text.toLowerCase();
      const userId = message.chat.id;

      if (text === "/card1") {
        const result = await getCard(userId, 1);
        await sendMessage(userId, formatCard(result));
      }

      if (text === "/card2") {
        const result = await getCard(userId, 2);
        await sendMessage(userId, formatCard(result));
      }

      if (text === "/card3") {
        const result = await getCard(userId, 3);
        await sendMessage(userId, formatCard(result));
      }

      if (await isSessionComplete(userId)) {
        await sendMessage(userId, `✅ Your reading is complete. May the cards guide your path.`);
      }
    }

    // 可拓展处理 callback_query（暂不使用）
    if (callback) {
      return res.sendStatus(200);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.sendStatus(500);
  }
});

function extractUserId(text) {
  const match = text.match(/UserID:\s*(\d+)/);
  return match ? match[1] : null;
}

function formatCard(card) {
  return `✨ *${card.name}*\n_${card.description}_`;
}

// ✅ 修复 Render 部署监听端口的问题
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Tarot service running on port ${PORT}`);
});
