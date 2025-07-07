function getRemainingButtons(drawn) {
  const all = [0, 1, 2];
  const remaining = all.filter(i => !drawn.includes(i));
  if (remaining.length === 0) return null;

  return [[
    ...remaining.map(i => ({
      text: `🃏 Card ${i + 1}`,
      callback_data: `card_${i}`
    }))
  ]];
}

module.exports = { getRemainingButtons };
