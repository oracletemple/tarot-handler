// G_pastlife.js - v1.0.0
// 🔮 Past Life Echoes - 高端模块（随机 21 段）

function getPastLifeEcho() {
  const echoes = [
    `🧿 *Past Life Echo*\n\nYou once walked barefoot through sacred forests, where every leaf whispered forgotten truths. In this life, your yearning for nature is a memory calling you home.`,

    `🧿 *Past Life Echo*\n\nYou were once a healer, crafting remedies with roots and chants. The urge to help others now is not new—it is the echo of ancient compassion.`,

    `🧿 *Past Life Echo*\n\nYou stood beneath temple arches, gazing at stars, mapping destinies for kings. Your intuition today is the echo of wisdom long studied.`,

    `🧿 *Past Life Echo*\n\nYou lived a quiet life by the sea, sketching ships and tides. The ocean still stirs something sacred within you.`,

    `🧿 *Past Life Echo*\n\nIn a life before, you were a storyteller—your voice shaped hearts. Your gift of words still lingers; speak with intention.`,

    `🧿 *Past Life Echo*\n\nYou once danced under moonlight not for joy, but as offering. Today, your body remembers rhythm and ritual.`,

    `🧿 *Past Life Echo*\n\nYou were silenced once—punished for speaking truth. That ache in your throat is the soul's memory. This life, reclaim your voice.`,

    `🧿 *Past Life Echo*\n\nYou once carried scrolls of sacred geometry across deserts. The visions that come in dreams are your soul’s old maps.`,

    `🧿 *Past Life Echo*\n\nYou were a keeper of time, counting stars and eclipses. That strange sense of divine timing you feel now? It’s not coincidence.`,

    `🧿 *Past Life Echo*\n\nYou lived in isolation, a seeker of silence. Now, solitude brings you wisdom, not loneliness.`,

    `🧿 *Past Life Echo*\n\nYou once sculpted stone for lost gods. Now, you shape meaning from the invisible. Your hands still remember.`,

    `🧿 *Past Life Echo*\n\nYou guided souls between worlds. Today, people turn to you for clarity without knowing why.`,

    `🧿 *Past Life Echo*\n\nYou were betrayed by someone you loved. Now, you guard your heart—not out of fear, but remembrance.`,

    `🧿 *Past Life Echo*\n\nYou once served as a diplomat between warring tribes. Your peacemaking instinct today echoes ancient negotiations.`,

    `🧿 *Past Life Echo*\n\nYou lived in exile. Now, the feeling of not belonging is a familiar echo—an invitation to finally root.`,

    `🧿 *Past Life Echo*\n\nYou danced with fire. You were fearless. That spark in you is not born of this world alone.`,

    `🧿 *Past Life Echo*\n\nYou wrote verses on temple walls. Now, your creativity flows when no one watches—it’s your sacred act.`,

    `🧿 *Past Life Echo*\n\nYou once failed a great mission. The urgency you feel today is your soul asking for redemption.`,

    `🧿 *Past Life Echo*\n\nYou were a mother who lost her child too soon. That tenderness in you is not just emotion—it’s inherited memory.`,

    `🧿 *Past Life Echo*\n\nYou were a monk who gave up everything. Now, your simplicity is sacred, not lack.`,

    `🧿 *Past Life Echo*\n\nYou once followed false prophets. Now, you question everything—and that is your soul protecting itself.`
  ];

  const random = Math.floor(Math.random() * echoes.length);
  return echoes[random];
}

module.exports = { getPastLifeEcho };
