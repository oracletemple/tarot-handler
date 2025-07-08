// G_higher-self.js - v1.1.0

function getHigherSelfMessage() {
  const messages = [
    "I am with you even in your silence. You are never truly alone.",
    "Let go of how it 'should be.' Trust what is.",
    "Your timing is divine. You are not behind.",
    "Breathe. Nothing is falling apart. Everything is falling into place.",
    "You are not here to be perfect—you are here to be whole.",
    "I see your longing. It is sacred. Follow it.",
    "Rest is not laziness. It is alignment.",
    "Speak your truth, even if your voice shakes.",
    "Your softness is strength. Stop hiding it.",
    "Forgive yourself. You are learning.",
    "There is no rush. You are unfolding at your own rhythm.",
    "Stop shrinking to fit spaces you've outgrown.",
    "What you're looking for is already within you.",
    "Trust the pause. It is preparing you.",
    "You are the prayer. You are the answer.",
    "Let your heart be louder than your fear.",
    "Even your doubt is holy. Bring it with you.",
    "The discomfort you feel is growth, not failure.",
    "Say no when you mean it. Say yes when you feel it.",
    "Your intuition is not irrational—it's your soul speaking.",
    "What if this breakdown is a breakthrough in disguise?",
    "You can begin again—now, and now, and now.",
    "You are not behind. You're on a spiral, not a straight line.",
    "Healing is not linear. Be gentle with your pace.",
    "The version of you you're becoming already loves you.",
    "No one else needs to understand. Your soul does.",
    "There’s wisdom in your wounds. Listen gently.",
    "Everything you release makes space for grace.",
    "You don’t need to do more. You need to be more present.",
    "I am within you. Always. You are never walking alone."
  ];

  const pick = messages[Math.floor(Math.random() * messages.length)];
  return `📬 *Message from Higher Self*\n\n${pick}`;
}

module.exports = { getHigherSelfMessage };
