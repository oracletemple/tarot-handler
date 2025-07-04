require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { handleDrawCard } = require('./utils/telegram');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const body = req.body;
  if (body.callback_query) {
    try {
      await handleDrawCard(body.callback_query);
      return res.sendStatus(200);
    } catch (err) {
      console.error('[ERROR] handleDrawCard failed:', err.message);
      return res.sendStatus(500);
    }
  }
  res.sendStatus(200);
});

app.get('/', (req, res) => res.send('Tarot Webhook Server is running.'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Tarot Webhook Server running at port ${PORT}`));
