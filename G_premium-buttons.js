// G_premium-buttons.js - v1.3.1

const { sendMessage } = require("./G_send-message");
const { getHigherSelf } = require("./G_higher-self");
const { getMirrorMessage } = require("./G_mirror-message");
const { getEnergyReading } = require("./G_energy-reading");
// 其他高端模块依次引入...

// 定义按钮组（每组最多展示三个按钮）
const premiumGroups = [
  [
    { text: "🧘 Higher Self", callback_data: "premium_higher" },
    { text: "🪞 Mirror Message", callback_data: "premium_mirror" },
    { text: "🌀 Energy Reading", callback_data: "premium_energy" }
  ]
  // 后续组可追加...
];

// 渲染当前组按钮
async function renderPremiumButtons(ctx, groupIndex = 0) {
  const group = premiumGroups[groupIndex];
  if (!group) return;

  const buttons = group.map((item) => [{ text: item.text, callback_data: item.callback_data }]);

  // 加入“下一组”按钮（如有）
  if (groupIndex < premiumGroups.length - 1) {
    buttons.push([{ text: "Next ➡️", callback_data: `next_${groupIndex + 1}` }]);
  }

  await sendMessage(ctx.chat.id, "✨ Choose your premium guidance:", {
    reply_markup: {
      inline_keyboard: buttons
    }
  });
}

// 高端模块处理函数映射
const premiumHandlers = {
  premium_higher: getHigherSelf,
  premium_mirror: getMirrorMessage,
  premium_energy: getEnergyReading
  // 其他模块注册...
};

// 响应按钮点击（渲染 Loading，再显示内容）
async function handlePremiumCallback(ctx, key) {
  const handler = premiumHandlers[key];
  if (typeof handler !== "function") return;

  // 显示 Loading
  await ctx.editMessageReplyMarkup({
    inline_keyboard: [[{ text: "⏳ Loading...", callback_data: "loading" }]]
  });

  // 获取解读内容
  const content = await handler(ctx.from.id);

  // 删除按钮，发送内容
  await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
  await sendMessage(ctx.chat.id, content);
}

module.exports = {
  renderPremiumButtons,
  handlePremiumCallback
};
