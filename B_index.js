// B_index.js - v1.2.0
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const { handleCallbackQuery, handleTextMessage } = require("./B_telegram");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.post("/webhook", async (req, res) => {
  const body = req.body;

  if (body.callback_query) {
    await handleCallbackQuery(body.callback_query);
  } else if (body.message && body.message.text) {
    await handleTextMessage(body.message);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
