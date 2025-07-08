// G_spirit-guide.js - v1.0.0

/**
 * 获取一个象征性的灵性守护灵及其寓意
 * 返回结构包括名称、物种、能量引导词、简短说明
 */
function getSpiritGuide() {
  const guides = [
    {
      name: "White Owl",
      type: "Animal",
      energy: "Wisdom & Vision",
      message: "The White Owl sees beyond illusions. Trust your inner knowing and follow the quiet voice of intuition."
    },
    {
      name: "Blue Lotus",
      type: "Plant",
      energy: "Spiritual Awakening",
      message: "The Blue Lotus blooms in still waters. Let go of chaos, and connect with your higher self through stillness."
    },
    {
      name: "Starlight Maiden",
      type: "Mystic Entity",
      energy: "Hope & Radiance",
      message: "She walks among stars, guiding lost souls. Even in darkness, your light is seen—never give up on your path."
    },
    {
      name: "Fire Wolf",
      type: "Animal",
      energy: "Courage & Transformation",
      message: "The Fire Wolf teaches that pain is the forge of strength. Embrace change, for it will lead to rebirth."
    },
    {
      name: "Celestial Serpent",
      type: "Mythical Being",
      energy: "Sacred Knowledge",
      message: "The serpent coils around truth. Seek deeper meaning in symbols, dreams, and the patterns of your journey."
    }
  ];

  const chosen = guides[Math.floor(Math.random() * guides.length)];
  return `🌟 *Your Spirit Guide: ${chosen.name}*\n_Type: ${chosen.type}_\n_Energy: ${chosen.energy}_\n\n${chosen.message}`;
}

module.exports = { getSpiritGuide };
