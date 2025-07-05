// v1.1.0 - tarot-handler/index.js

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { handleCardClick } = require("./utils/tarot");

const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  const message = req.body.message;
  if (!message || !message.from || !message.from.id) return res.sendStatus(200);

  const userId = message.from.id;
  const text = message.text?.trim();

  if (text === "🃏 Card 1") await handleCardClick(userId, 0);
  else if (text === "🃏 Card 2") await handleCardClick(userId, 1);
  else if (text === "🃏 Card 3") await handleCardClick(userId, 2);

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Tarot service running on port ${PORT}`);
});
