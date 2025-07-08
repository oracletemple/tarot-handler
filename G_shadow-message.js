// G_shadow-message.js - v1.0.0

/**
 * 返回一条“你需要面对的内在阴影”
 */
function getShadowMessage() {
  const messages = [
    "You often avoid conflict, but truth requires confrontation.",
    "You fear rejection, so you silence your needs.",
    "You hide your pain behind productivity.",
    "You chase perfection to avoid vulnerability.",
    "You fear stillness because it reveals your true feelings.",
    "You attach to others to avoid facing your own emptiness.",
    "You suppress anger, yet it leaks in passive ways.",
    "You fear being ordinary, so you overextend to feel worthy."
  ];

  const pick = messages[Math.floor(Math.random() * messages.length)];
  return `🔮 *Shadow Message*\n\n${pick}`;
}

module.exports = { getShadowMessage };
