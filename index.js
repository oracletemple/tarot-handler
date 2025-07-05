// v1.1.6 - index.js
const express = require("express");
const bodyParser = require("body-parser");
const { sendCardButtons, handleTransaction } = require("./utils/telegram");
const { startSession, getCard, isSessionComplete } = require("./utils/tarot-session");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// ✅ Webhook 接口入口：处理交易通知或按钮点击
app.post("/webhook", async (req, res) => {
  const body = req.body;

  // 🧾 情况一：按钮点击事件
  if (body.callback_query) {
    const userId = body.callback_query.from.id;
    const data = body.callback_query.data;

    if (!data.startsWith("card_")) return res.sendStatus(200);

    const cardIndex = parseInt(data.replace("card_", ""));
    if (isNaN(cardIndex)) return res.sendStatus(200);

    const result = await getCard(userId, cardIndex);
    if (!result) return res.sendStatus(200);

    // 调用按钮处理器并传入当前 session 状态
    await handleTransaction({ callback_query: body.callback_query });

    // 如果三张牌已全部抽完，清空按钮
    if (isSessionComplete(userId)) {
      await sendCardButtons(userId, true); // 清空按钮模式
    }

    return res.sendStatus(200);
  }

  // 💸 情况二：链上转账成功，启动新会话并发送按钮
  if (body.transaction && body.transaction.to === "TYQQ3QigecskEi4B41BKDoTsmZf9BaFTbU") {
    const { amount, from, user_id } = body.transaction;

    if (amount >= 10) {
      await startSession(user_id);
      await sendCardButtons(user_id); // 初始发送按钮
    }

    return res.sendStatus(200);
  }

  res.sendStatus(200);
});

// ✅ 启动服务
app.listen(PORT, () => {
  console.log(`Tarot service running on port ${PORT}`);
});
