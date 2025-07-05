// v1.1.4
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { processTransaction } = require('./utils/processor');
require('./utils/telegram'); // ensure bot is launched

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  try {
    const tx = req.body;
    await processTransaction(tx);
    res.status(200).send('OK');
  } catch (error) {
    console.error('[ERROR] /webhook failed:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Tarot Webhook Server running at http://localhost:${PORT}`);
});
