export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { tried, smoke, intensity, age } = req.body;

  let baseDose = 50;

  if (tried === 'daily') baseDose += 60;
  else if (tried === 'often') baseDose += 35;
  else if (tried === 'occasionally') baseDose += 15;

  if (smoke === 'daily') baseDose += 40;
  else if (smoke === 'weekend') baseDose += 15;

  if (intensity === 'strong') baseDose += 60;
  else if (intensity === 'balanced') baseDose += 25;

  if (age === '18') baseDose -= 10;
  else if (age === '60') baseDose -= 5;

  // Controlli finali
  baseDose = Math.min(1000, Math.max(20, baseDose));

  // Risposta più "umana"
  let msg = `💡 Ti consiglio di iniziare con **${baseDose}mg di THC**.`;
  if (baseDose <= 50) msg += `\nPerfetto per un primo approccio soft, senza sorprese.`;
  else if (baseDose <= 150) msg += `\nDovresti avvertire un effetto piacevole e bilanciato.`;
  else if (baseDose <= 300) msg += `\nPreparati a un viaggio profondo. Goditelo in un contesto rilassato.`;
  else msg += `\nLivello esperto. Ti consiglio di restare a casa, playlist chill, e niente impegni!`;

  return res.status(200).json({
    dose: baseDose,
    message: msg
  });
}
