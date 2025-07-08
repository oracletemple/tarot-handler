// G_cosmic-alignment.js - v1.0.0

/**
 * 返回一段“宇宙联结指引”
 */
function getCosmicAlignment() {
  const messages = [
    "Today, the stars hold stillness. The cosmos invites you inward, to listen before you leap.",
    "The moon speaks of release. It is a good day to let go of what no longer carries your name.",
    "Mercury’s clarity is upon you—speak truth without fear of its echo.",
    "You are not separate from the heavens. The alignment is within you now.",
    "Today carries a soft cosmic current. Flow with it, not against it.",
    "The sky whispers renewal. Let the old version of you die gently.",
    "A portal opens. Trust what calls you, even if the way is unseen.",
    "Solar fire awakens your courage. Take bold but sacred action.",
    "The universe mirrors your frequency. Tune your thoughts to gratitude.",
    "Today is not about doing—it's about becoming.",
    "The stars do not rush, yet all things unfold. Neither should you.",
    "A rare alignment stirs your intuition. Trust your first instinct.",
    "The cosmos rests. It’s your turn to soften, to pause, to receive.",
    "Something ancient in you is waking. Follow the breadcrumbs of your curiosity.",
    "Venus blesses your beauty and connection. Lead with warmth today.",
    "Saturn grounds your growth. Choose one thing to commit to with reverence.",
    "The veil is thin. Pay attention to symbols, numbers, dreams.",
    "Your energy is not random. You are a thread in a cosmic weave.",
    "This moment is not accidental. It was written in the stars long before you arrived."
  ];

  const pick = messages[Math.floor(Math.random() * messages.length)];
  return `🌌 *Cosmic Alignment*\n\n${pick}`;
}

module.exports = { getCosmicAlignment };
