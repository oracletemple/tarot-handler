const axios = require('axios');

const TARGET_URL = process.env.KEEP_ALIVE_URL || 'https://tarot-handler.onrender.com';
const INTERVAL = 10 * 60 * 1000; // 每 10 分钟请求一次（Render 限制 15 分钟休眠）

function keepAlive() {
  console.log(`[KEEP-ALIVE] Pinging ${TARGET_URL}`);
  axios.get(TARGET_URL)
    .then(() => console.log('[KEEP-ALIVE] ✅ Ping successful'))
    .catch(err => console.error('[KEEP-ALIVE] ❌ Ping failed:', err.message));
}

// 启动定时器
setInterval(keepAlive, INTERVAL);
