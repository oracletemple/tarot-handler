// utils/telegram.js - v1.2.2
import fetch from "node-fetch";
import { getCard, isSessionComplete, getSession } from "./tarot-session.js";
import cardData from "./card-data.js";

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendButtonsMessage(userId) {
  const keyboard = {
    inline_keyboard: [
      [
        { text: "🃏 Card 1", callback_data: "card_1" },
        { text: "🃏 Card 2", callback_data: "card_2" },
        { text: "🃏 Card 3", callback_data: "card_3" }
      ]
    ]
  };

  await fetch(`${API_URL}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: userId,
      text: "✨ Please choose your card:",
      reply_markup: keyboard
    })
  });
}

export async function sendCardResult(userId, cardIndex) {
  const session = getSession(userId);
  const card = cardData[cardIndex];

  const position = session.cardsDrawn.length === 1
    ? "🌅 Past"
    : session.cardsDrawn.length === 2
    ? "🌟 Present"
    : "🌠 Future";

  const message = `${position}: ${card.name}\n\n${card.meaning}`;

  await fetch(`${API_URL}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: userId,
      text: message
    })
  });

  // 若已抽完 3 张牌，移除按钮
  if (isSessionComplete(userId)) {
    await fetch(`${API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: userId,
        text: "🔮 Your full Tarot spread is complete. Thank you!",
      }),
    });
  }
}

export async function handleCardClick(ctx) {
  const userId = ctx.from.id;
  const data = ctx.callbackQuery.data;
  const index = parseInt(data.split("_")[1], 10) - 1;

  const session = getSession(userId);
  if (!session) {
    await ctx.answerCbQuery("⚠️ Session not found. Please try again later.");
    return;
  }

  if (session.cardsDrawn.includes(session.deck[index])) {
    await ctx.answerCbQuery("⚠️ You've already drawn this card.");
    return;
  }

  const cardIndex = getCard(userId, index);
  if (cardIndex === null) {
    await ctx.answerCbQuery("⚠️ Unable to draw card.");
    return;
  }

  await ctx.answerCbQuery("✅ Card drawn!");
  await sendCardResult(userId, cardIndex);
}
