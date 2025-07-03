// ✅ 文件名：index.js
// ✅ 部署位置：新建 GitHub 仓库（建议命名 tarot-handler），并部署到 Render 的 Web Service

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { sendMessage, handleDrawCard } = require('./utils/telegram');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// ✅ 设置 webhook 接收点
app.post('/webhook', async (req, res) => {
  const body = req.body;

  // 接收按钮回调
  if (body.callback_query) {
    const { data, message, from } = body.callback_query;
    const chatId = message.chat.id;
    await handleDrawCard(chatId, data, message.message_id);
    return res.sendStatus(200);
  }

  // 接收常规消息（备用）
  if (body.message) {
    const { text, chat } = body.message;
    const chatId = chat.id;
    if (text === '/start') {
      await sendMessage(chatId, '✨ Welcome to Divine Oracle Tarot Bot. Please make a donation to start.');
    }
    return res.sendStatus(200);
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`🚀 Tarot Webhook Server running at http://localhost:${PORT}`);
});
