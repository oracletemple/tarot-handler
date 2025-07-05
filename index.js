// v1.1.2 - Webhook入口主模块（不再依赖 dotenv）

const express = require("express");
const bodyParser = require("body-parser");
const { sendMessage } = require("./utils/telegram");
const { startSession, isSessionComplete, getCard } = require("./utils/tarot-session");

const app = express();
app.use(bodyParser.json());

// ✅ 自动注入配置变量（无需dotenv）
const BOT_TOKEN = "7842470393:AAG6T07t_fzzZIOBrccWKF-A_gGPweVGVZc";
const RECEIVER_ID = "7685088782";
const AMOUNT_THRESHOLD = 10;

// ✅ 模拟测试标记（Render部署后自动触发）
let testCount = 0;

// 🔔 主 webhook 接口
app.post("/webhook", async (req, res) => {
  const body = req.body;

  // ✅ 交易监听逻辑
  if (body.type === "transaction") {
    const { amount, sender, receiver } = body.data;
    if (
      receiver === RECEIVER_ID &&
      parseFloat(amount) >= AMOUNT_THRESHOLD
    ) {
      await startSession(sender);
      await sendMessage(sender, `🔔 We've received your payment.\n\nPlease choose a card below to begin your reading:`, {
        reply_markup: {
          inline_keyboard: [[
            { text: "🃏 Card 1", callback_data: "card_1" },
            { text: "🃏 Card 2", callback_data: "card_2" },
            { text: "🃏 Card 3", callback_data: "card_3" }
          ]]
        }
      });
    }
    return res.sendStatus(200);
  }

  // ✅ 按钮点击逻辑
  if (body.callback_query) {
    const userId = body.callback_query.from.id;
    const data = body.callback_query.data;
    const messageId = body.callback_query.message.message_id;

    if (data.startsWith("card_")) {
      const index = parseInt(data.split("_")[1]) - 1;
      const result = await getCard(userId, index);
      await sendMessage(userId, result);

      if (await isSessionComplete(userId)) {
        await sendMessage(userId, `🌟 You've drawn all three cards. Your reading is complete. Thank you!`);
      }
    }
    return res.sendStatus(200);
  }

  res.sendStatus(200);
});

// ✅ 首页测试
app.get("/", (req, res) => {
  res.send("Tarot Webhook Running ✅");
});

// ✅ 自动模拟交易测试（首次部署后运行一次）
setTimeout(async () => {
  if (testCount === 0) {
    testCount++;
    await simulatePayment("12", RECEIVER_ID);
    await simulatePayment("30", RECEIVER_ID);
  }
}, 5000);

// ✅ 模拟函数
async function simulatePayment(amount, receiver) {
  await fetch("http://localhost:3000/webhook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "transaction",
      data: {
        sender: "999999999",
        receiver,
        amount
      }
    })
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Tarot service running on port ${PORT}`);
});
