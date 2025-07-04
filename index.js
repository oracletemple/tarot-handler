const express = require('express');
const bodyParser = require('body-parser');
const { handleDrawCard } = require('./utils/telegram');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    console.log('[Webhook Received]', JSON.stringify(body, null, 2));

    // Only process callback queries
    if (body.callback_query) {
      const chatId = body.callback_query.message.chat.id;
      const data = body.callback_query.data;

      console.log('[Callback Query]', data);

      await handleDrawCard(chatId, data);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('[Webhook Error]', error);
    res.sendStatus(500);
  }
});

app.get('/', (req, res) => {
  res.send('🔮 Tarot Webhook Server is running');
});

app.listen(PORT, () => {
  console.log(`🚀 Tarot Webhook Server running at http://localhost:${PORT}`);
});
