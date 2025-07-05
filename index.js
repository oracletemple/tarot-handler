// index.js - v1.1.7
const express = require("express");
const bodyParser = require("body-parser");
const { handleTransaction, sendCardButtons } = require("./utils/telegram");
const { startSession, getCard, isSessionComplete } = require("./utils/tarot-session");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.callback_query) {
    const { callback_query } = body;
    const userId = callback_query.from.id;
    const data = callback_query.data;
    const cardIndex = parseInt(data.replace("card_", ""));

    await handleTransaction({ callback_query });

    if (!isNaN(cardIndex)) {
      const result = await getCard(userId, cardIndex);
      console.log("Card Drawn:", result.text);
    }
    return res.sendStatus(200);
  }

  if (body.transaction && body.transaction.to === process.env.WALLET_ADDRESS) {
    const { amount, user_id } = body.transaction;
    if (amount >= process.env.AMOUNT_THRESHOLD) {
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
