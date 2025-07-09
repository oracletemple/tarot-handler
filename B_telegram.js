// B_telegram.js - v1.5.5

const axios = require("axios");
const { getCardInfo } = require("./G_tarot");
const { getSpiritGuide } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");

const { getPremiumMessage } = require("./G_premium-modules");
const { getNextButtonGroup, resetPremiumProgress } = require("./G_premium-buttons");

const { sendTelegramMessage, sendTelegramPhoto, sendTelegramButtons } = require("./G_send-message");
const { startSession, isSessionComplete, storeCard, getCard } = require("./G_tarot-session");

async function handleTelegramUpdate(req, res) {
  const body = req.body;
  if (!body) return res.sendStatus(200);

  // ✅ 命令入口 - /test123
  if (body.message?.text === "/test123" && body.message.from.id === 7685088782) {
    const userId = body.message.from.id;
    await startSession(userId);

    await sendTelegramMessage(userId, "🃏 *Your spiritual reading is ready. Please choose a card to reveal:*", [
      [{ text: "🃏 Card 1", callback_data: "card_1_12" }, { text: "🃏 Card 2", callback_data: "card_2_12" }, { text: "🃏 Card 3", callback_data: "card_3_12" }]
    ]);
    return res.sendStatus(200);
  }

  // ✅ 高端测试指令：/test30
  if (body.message?.text === "/test30" && body.message.from.id === 7685088782) {
    const userId = body.message.from.id;
    await startSession(userId);

    await sendTelegramMessage(userId, "🃏 *Your premium spiritual reading is ready. Choose a card to begin:*", [
      [{ text: "🃏 Card 1", callback_data: "card_1_30" }, { text: "🃏 Card 2", callback_data: "card_2_30" }, { text: "🃏 Card 3", callback_data: "card_3_30" }]
    ]);
    return res.sendStatus(200);
  }

  // ✅ 按钮点击处理
  if (body.callback_query) {
    const query = body.callback_query;
    const userId = query.from.id;
    const data = query.data;

    // --- 卡牌抽取处理 ---
    if (data.startsWith("card_")) {
      const [_, indexStr, amountStr] = data.split("_");
      const index = parseInt(indexStr);
      const amount = parseInt(amountStr);

      const stored = storeCard(userId, index);
      const card = getCard(userId, index);

      if (!stored || !card) return res.sendStatus(200);

      const info = getCardInfo(userId, index);
      if (info.image) {
        await sendTelegramPhoto(userId, info.image, `${info.title}\n\n${info.meaning}`);
      } else {
        await sendTelegramMessage(userId, `${info.title}\n\n${info.meaning}`);
      }

      // 删除已点击按钮，仅保留未抽的牌
      const remainingButtons = [];
      for (let i = 1; i <= 3; i++) {
        if (!getCard(userId, i)) {
          remainingButtons.push({ text: `🃏 Card ${i}`, callback_data: `card_${i}_${amount}` });
        }
      }
      if (remainingButtons.length > 0) {
        await sendTelegramButtons(userId, "Choose another card:", [remainingButtons]);
      }

      // 三张牌完成后推送灵性模块
      if (isSessionComplete(userId)) {
        await sendTelegramMessage(userId, await getSpiritGuide());
        await sendTelegramMessage(userId, await getLuckyHints());
        await sendTelegramMessage(userId, await getMoonAdvice());

        await sendTelegramMessage(userId, "✨ Unlock your deeper guidance:");
        resetPremiumProgress(userId);
        const group = getNextButtonGroup(userId);
        if (group) await sendTelegramButtons(userId, "Choose a divine insight:", [group]);
      }
      return res.sendStatus(200);
    }

    // --- 高端灵性模块按钮点击 ---
    if (data.startsWith("premium_")) {
      const content = await getPremiumMessage(userId, data);
      await sendTelegramMessage(userId, content);

      const nextGroup = getNextButtonGroup(userId);
      if (nextGroup) {
        await sendTelegramButtons(userId, "Choose another insight:", [nextGroup]);
      }
      return res.sendStatus(200);
    }
  }

  return res.sendStatus(200);
}

module.exports = { handleTelegramUpdate };
