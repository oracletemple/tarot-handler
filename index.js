// ✅ v1.1.6 /index.js - 通用 webhook 接口入口（支持交易与按钮点击）
const express = require("express");
const bodyParser = require("body-parser");
const { sendCardButtons, handleTransaction } = require("./utils/telegram");
const { startSession, getCard, isSessionComplete } = require("./utils/tarot-session");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const WALLET_ADDRESS = "TYQQ3QigecskEi4B41BKDoTsmZf9BaFTbU";
const AMOUNT_THRESHOLD = 10;

// ✅ 统一 Webhook 接口（交易推送 + 按钮点击）
app.post("/webhook", async (req, res) => {
  const body = req.body;

  // ✅ 按钮点击事件
  if (body.callback_query) {
    const userId = body.callback_query.from.id;
    const data = body.callback_query.data;

    // 限制重复点击：获取按钮序号
    const cardIndex = parseInt(data.replace("card_", ""));
    if (isNaN(cardIndex)) return res.sendStatus(200);

    // 抽牌逻辑
    const result = await getCard(userId, cardIndex);
    if (!result || !result.text) return res.sendStatus(200);

    // 回复牌面文字 + 更新按钮（少一张）
    await handleTransaction({ callback_query: body.callback_query });
    return res.sendStatus(200);
  }

  // ✅ 模拟或真实交易事件（新版结构）
  if (body.transaction && body.transaction.to === WALLET_ADDRESS) {
    const { amount, from, user_id } = body.transaction;

    if (amount >= AMOUNT_THRESHOLD && user_id) {
      await startSession(user_id);
      await sendCardButtons(user_id);
    }
    return res.sendStatus(200);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Tarot service running on port ${PORT}`);
});
