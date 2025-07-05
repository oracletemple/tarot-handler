// index.js · v1.1.5
require('dotenv').config();
const express = require('express');
const { bot, webhookCallback } = require('./utils/telegram');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/webhook', webhookCallback);

app.listen(PORT, () => {
  console.log(`🚀 Tarot Webhook Server running at http://localhost:${PORT}`);
});
