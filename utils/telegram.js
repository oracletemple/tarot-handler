// telegram.js - v1.2.2 (修复按钮 callback_data 包含金额字段)

import { sendMessage, sendCardButtons, sendCardResult, updateMessageButtons } from "./send-message.js";
import { getCard, isSessionComplete, getSession, removeCardFromSession } from "./tarot-session.js";
import cardData from "./card-data.js";

export async function handleWebhookUpdate(req, res) {
  const body = req.body;
  console.log("\u{1F4E5} Received Webhook Payload:", JSON.stringify(body, null, 2));

  // 处理交易成功推送按钮
  if (body.user_id && body.amount) {
    const userId = body.user_id;
    const amount = body.amount;
    await sendCardButtons(userId, amount);
    return res.status(200).send("✅ Buttons sent");
  }

  // 处理 Telegram 回调按钮点击
  const callback = body.callback_query;
  if (callback && callback.data && callback.from) {
    const userId = callback.from.id;
    const data = callback.data;

    if (data?.startsWith("draw_card_")) {
      const parts = data.split("_"); // draw_card_1_12
      const cardIndex = parseInt(parts[2]) - 1;
      const amount = parseFloat(parts[3]);

      if (isNaN(cardIndex) || isNaN(amount)) {
        console.log("❌ Invalid button format:", data);
        return res.status(200).send("❌ Invalid button");
      }

      await handleCardDraw(userId, cardIndex, amount, callback);
      return res.status(200).send("✅ Card drawn");
    }
  }

  res.status(200).send("⚠️ No action taken");
}

async function handleCardDraw(userId, index, amount, callback) {
  const session = getSession(userId);
  if (!session) {
    await sendMessage(userId, "⚠️ Session not found. Please try again later.");
    return;
  }

  const cardId = getCard(userId, index);
  if (cardId === null) {
    await sendMessage(userId, "⚠️ Invalid card or already drawn.");
    return;
  }

  const card = cardData[cardId];
  if (!card) {
    await sendMessage(userId, "⚠️ Card not found in database.");
    return;
  }

  await sendCardResult(userId, card, index);

  if (isSessionComplete(userId)) {
    await updateMessageButtons(callback.message.message_id, userId);
  }
}
