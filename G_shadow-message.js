// G_shadow-message.js - v1.1.0

function getShadowMessage() {
  const messages = [
    "You avoid stillness because it reveals what you’d rather not face.",
    "You seek validation from others to avoid facing your own self-doubt.",
    "You become overly busy to escape your feelings of unworthiness.",
    "You control situations to feel safe—but in doing so, you restrict your own growth.",
    "You judge others harshly to avoid confronting your inner critic.",
    "You fear being ordinary, so you constantly overperform.",
    "You confuse people-pleasing with love.",
    "You push away intimacy to avoid vulnerability.",
    "You resent others’ freedom because you’ve denied your own.",
    "You smile when you want to cry. You perform strength instead of honoring pain.",
    "You chase new beginnings to avoid sitting with endings.",
    "You lash out when you feel unseen, yet struggle to ask for attention.",
    "You say 'yes' when you mean 'no'—and then carry silent resentment.",
    "You wear self-reliance as armor to hide your fear of being a burden.",
    "You manipulate outcomes rather than surrender to divine timing.",
    "You avoid asking for help to preserve an illusion of control.",
    "You downplay your desires to make others comfortable.",
    "You fear disappointment so deeply, you stop hoping altogether.",
    "You perform 'healing' to avoid truly feeling.",
    "You hide your intuition under logic to avoid being wrong."
  ];

  const pick = messages[Math.floor(Math.random() * messages.length)];
  return `🔮 *Shadow Message*\n\n${pick}`;
}

module.exports = { getShadowMessage };
