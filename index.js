// index.js - tarot-handler v1.1.5
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { handleTelegramUpdate } = require("./utils/telegram");

const app = express();
app.use(bodyParser.json());

app.post("/webhook", async (req, res) => {
  const update = req.body;
  await handleTelegramUpdate(update);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Tarot service running on port ${PORT}`);
});
