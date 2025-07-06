// index.js - v1.1.8
const express = require("express");
const bodyParser = require("body-parser");
const { sendButtonMessage, handleCallbackQuery } = require("./utils/telegram");
const { startSession } = require("./utils/tarot-session");

const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  const body = req.body;

  // 回调按钮交互
  if (body.callback_query) {
    await handleCallbackQuery(body.callback_query);
    return res.sendStatus(200);
  }

  // 正常付款 webhook
  const { user_id, amount } = body;
  if (!user_id || !amount || amount < 10) {
    console.warn("⚠️ Invalid or low amount received:", amount);
    return res.sendStatus(400);
  }

  await startSession(user_id);
  await sendButtonMessage(
    user_id,
    "✨ Thank you for your payment. Please draw your cards:"
  );

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
