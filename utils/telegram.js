// utils/telegram.js - v1.2.1
import fetch from "node-fetch";
import { startSession, getCard, isSessionComplete, endSession } from "./tarot-session.js";

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function sendMessage(chatId, text, options = {}) {
  await fetch(`${API_URL}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, ...options }),
  });
}

export async function sendButtonsMessage(chatId, amount) {
  const keyboard = {
    inline_keyboard: [
      [
        { text: "🃏 Card 1", callback_data: `card_1_${amount}` },
        { text: "🃏 Card 2", callback_data: `card_2_${amount}` },
        { text: "🃏 Card 3", callback_data: `card_3_${amount}` },
      ],
    ],
  };

  await sendMessage(chatId, "Your spiritual reading is ready. Please choose a card to reveal:", {
    reply_markup: keyboard,
  });

  await startSession(chatId, amount);
}

export async function sendCardResult(chatId, index, amount) {
  const card = await getCard(chatId, index);
  if (!card) return;

  const label = ["Past", "Present", "Future"][index - 1] || "Card";

  const caption = `✨ *${label}*\n\n🃏 *${card.name}*\n_${card.meaning}_\n\n🔮 Amount: ${amount} USDT`;
  await sendMessage(chatId, caption, { parse_mode: "Markdown" });

  if (isSessionComplete(chatId)) {
    await endSession(chatId);

    // 删除按钮（编辑消息）
    await fetch(`${API_URL}/editMessageReplyMarkup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: (await getLastBotMessageId(chatId)),
        reply_markup: { inline_keyboard: [] },
      }),
    });
  }
}

export async function handleTelegramUpdate(body) {
  if (body.message) return; // ignore normal messages

  const query = body.callback_query;
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  const match = data.match(/^card_(\d)_(\d+)/);
  if (!match) return;

  const index = parseInt(match[1]);
  const amount = parseInt(match[2]);

  if (isNaN(index) || isNaN(amount)) {
    await sendMessage(chatId, "⚠️ Invalid card data.");
    return;
  }

  const sessionExists = await getCard(chatId, index); // also triggers session validation
  if (!sessionExists) {
    await sendMessage(chatId, "⚠️ Session not found or already completed.");
    return;
  }

  await sendCardResult(chatId, index, amount);
}

async function getLastBotMessageId(chatId) {
  const res = await fetch(`${API_URL}/getUpdates`);
  const data = await res.json();
  const updates = data.result.reverse();

  for (let update of updates) {
    if (
      update.message &&
      update.message.chat.id === chatId &&
      update.message.from &&
      update.message.from.is_bot
    ) {
      return update.message.message_id;
    }
  }

  return null;
}
