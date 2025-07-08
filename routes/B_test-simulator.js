// routes/B_test-simulator.js - v1.1.1

const express = require("express");
const router = express.Router();

const { startSession } = require("../G_tarot-session");
const { sendCardButtons, handleCallback } = require("../B_telegram");

const DEV_ID = 7685088782; // 仅允许开发者触发测试流程

router.post("/webhook", async (req, res) => {
  const update = req.body;

  try {
    // 处理指令消息
    if (update.message && update.message.text) {
      const text = update.message.text.trim();
      const chatId = update.message.chat.id;
      const userId = update.message.from.id;

      // 开发者专属测试入口
      if (userId === DEV_ID && text === "/test123") {
        console.log("✅ /test123 triggered by developer");

        // 启动 session（12 USDT 流程）
        startSession(userId, 12);
        const messageId = await sendCardButtons(chatId, 12);

        // 模拟三张牌点击（延迟触发）
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            const fakeQuery = {
              id: `test_${i}`,
              from: { id: userId },
              message: { chat: { id: chatId }, message_id: messageId },
              data: `card_${i}`
            };
            handleCallback(fakeQuery);
            console.log(`✅ Simulated card ${i + 1} click for user ${userId}`);
          }, 1000 + i * 1500);
        }

        return res.sendStatus(200);
      }
    }

    // 处理按钮点击
    if (update.callback_query) {
      await handleCallback(update.callback_query);
      return res.sendStatus(200);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error in /webhook:", err.message);
    res.sendStatus(500);
  }
});

module.exports = router;
