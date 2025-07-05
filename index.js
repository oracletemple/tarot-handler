// ✅ index.js（v1.1.3）支持按钮点击抽牌逻辑
const express = require("express");
const bodyParser = require("body-parser");
const { sendMessage } = require("./utils/telegram");
const { startSession, getCard, isSessionComplete } = require("./utils/tarot-session");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 10000;
const RECEIVER_ID = "7685088782"; // 用户 Telegram ID
const AMOUNT_THRESHOLD = 10;

app.post("/webhook", async (req, res) => {
  const { amount } = req.body;

  if (typeof amount !== "number") {
    return res.status(400).json({ error: "Missing amount" });
  }

  try {
    if (amount >= 30) {
      await sendMessage(RECEIVER_ID, `✨ *We've received your 30 USDT payment!*

You now have access to a *personalized spiritual reading*, including:
- Full Tarot spread
- Spirit guide interpretation
- Lunar influence analysis
- GPT-based deep interpretation

We'll follow up with your reading shortly.`);
    }

    if (amount >= AMOUNT_THRESHOLD) {
      await startSession(RECEIVER_ID);

      await sendMessage(
        RECEIVER_ID,
        `🎉 *We've received your payment.*\n\nPlease choose a card below to begin your reading:`,
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "🃏 Card 1", callback_data: "card_1" },
                { text: "🃏 Card 2", callback_data: "card_2" },
                { text: "🃏 Card 3", callback_data: "card_3" }
              ]
            ]
          }
        }
      );
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/callback", async (req, res) => {
  const { callback_query } = req.body;

  if (!callback_query) return res.sendStatus(200);

  const userId = callback_query.from.id;
  const data = callback_query.data;
  const indexMap = { card_1: 0, card_2: 1, card_3: 2 };

  if (data in indexMap) {
    const cardIndex = indexMap[data];
    const card = await getCard(userId, cardIndex);

    if (card) {
      await sendMessage(userId, `🔮 *Card ${cardIndex + 1}:* ${card.title}\n\n_${card.description}_`);
    } else {
      await sendMessage(userId, `Card already drawn or invalid.`);
    }

    if (await isSessionComplete(userId)) {
      await sendMessage(userId, `✅ Your tarot reading is complete. Trust your intuition and stay aligned.`);
    }
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`USDT listener running on port ${PORT}`);
});
