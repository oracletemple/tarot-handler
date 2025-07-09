// B_telegram.js - v1.5.4

const { Telegraf } = require("telegraf");
const { getSession, startSession, isSessionComplete, getCard } = require("./G_tarot-session");
const { getCardMeaning } = require("./G_tarot-engine");
const { renderCardButtons } = require("./G_button-render");
const { getSpiritGuide } = require("./G_spirit-guide");
const { getLuckyHints } = require("./G_lucky-hints");
const { getMoonAdvice } = require("./G_moon-advice");
const { getPremiumButtonsByGroup, getNextPremiumGroupIndex } = require("./G_premium-buttons");

// 🔮 GPT 高端灵性模块
const { getTarotSummary } = require("./G_tarot-summary");
const { getJournalPrompt } = require("./G_journal-prompt");
const { getShadowMessage } = require("./G_shadow-message");
const { getSoulArchetype } = require("./G_soul-archetype");
const { getHigherSelf } = require("./G_higher-self");
const { getCosmicAlignment } = require("./G_cosmic-alignment");
const { getOracleCard } = require("./G_oracle-card");
const { getPastLifeEcho } = require("./G_pastlife");
const { getSoulPurpose } = require("./G_soul-purpose");
const { getKarmaCycle } = require("./G_karma-cycle");
const { getEnergyReading } = require("./G_energy-reading");
const { getDivineTiming } = require("./G_divine-timing");
const { getSacredSymbol } = require("./G_sacred-symbol");
const { getSpiritMessage } = require("./G_spirit-message");
const { getMirrorMessage } = require("./G_mirror-message");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply("🔮 Welcome to Divine Oracle Bot!"));

bot.command("test30", async (ctx) => {
  const userId = ctx.from.id;
  const session = startSession(userId, 30);
  await ctx.reply("✅ Test mode activated (30 USDT). Please choose your card:");
  await ctx.reply("Please draw your cards:", renderCardButtons(userId));
});

bot.command("test123", async (ctx) => {
  const userId = ctx.from.id;
  const session = startSession(userId, 12);
  await ctx.reply("✅ Test mode activated (12 USDT). Please choose your card:");
  await ctx.reply("Please draw your cards:", renderCardButtons(userId));
});

bot.on("callback_query", async (ctx) => {
  const userId = ctx.from.id;
  const data = ctx.callbackQuery.data;
  const session = getSession(userId);

  if (data.startsWith("draw_card_")) {
    const index = parseInt(data.split("_")[2]);
    if (!session) return ctx.reply("⚠️ Session not found. Please try again later.");
    try {
      const card = getCard(userId, index);
      const meaning = getCardMeaning(card.name);
      const position = ["🌒 Past", "🌕 Present", "🌘 Future"][index];
      await ctx.reply(`${position}\n🃏 ${card.name}\n\n${meaning}`);
      const updated = renderCardButtons(userId);
      if (updated) {
        await ctx.editMessageReplyMarkup(updated.reply_markup);
      }
      if (isSessionComplete(userId)) {
        const guide = await getSpiritGuide();
        const hints = await getLuckyHints();
        const moon = await getMoonAdvice();
        await ctx.reply(guide);
        await ctx.reply(hints);
        await ctx.reply(moon);
        if (session.amount === 30) {
          await ctx.reply("✨ Unlock your deeper guidance:", getPremiumButtonsByGroup(0));
        }
      }
    } catch (err) {
      console.error("Draw card error:", err);
      ctx.reply("⚠️ Error drawing card. Please try again.");
    }
    return;
  }

  // 高端互动模块
  const premiumMap = {
    premium_summary: getTarotSummary,
    premium_journal: getJournalPrompt,
    premium_shadow: getShadowMessage,
    premium_archetype: getSoulArchetype,
    premium_higher: getHigherSelf,
    premium_cosmic: getCosmicAlignment,
    premium_oracle: getOracleCard,
    premium_pastlife: getPastLifeEcho,
    premium_purpose: getSoulPurpose,
    premium_karma: getKarmaCycle,
    premium_energy: getEnergyReading,
    premium_timing: getDivineTiming,
    premium_symbol: getSacredSymbol,
    premium_spirit: getSpiritMessage,
    premium_mirror: getMirrorMessage,
  };

  if (premiumMap[data]) {
    const reply = await premiumMap[data](userId, session?.cards);
    await ctx.reply(reply);
    const nextGroup = getNextPremiumGroupIndex(data);
    if (nextGroup !== null) {
      const nextButtons = getPremiumButtonsByGroup(nextGroup);
      if (nextButtons) await ctx.reply("✨ Keep exploring:", nextButtons);
    }
    return;
  }
});

module.exports = bot;
