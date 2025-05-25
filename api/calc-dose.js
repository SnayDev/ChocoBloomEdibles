export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { tried, smoke, intensity, age } = req.body;

  // Semplice ragionamento AI-based (puoi migliorarlo in futuro)
  let baseDose = 50;

  if (tried === 'daily') baseDose += 50;
  else if (tried === 'often') baseDose += 30;
  else if (tried === 'occasionally') baseDose += 15;

  if (smoke === 'daily') baseDose += 40;
  else if (smoke === 'weekend') baseDose += 15;

  if (intensity === 'strong') baseDose += 50;
  else if (intensity === 'balanced') baseDose += 25;

  if (age === '18') baseDose -= 10;
  else if (age === '60') baseDose -= 5;

  baseDose = Math.min(1000, Math.max(20, baseDose));

  return res.status(200).json({
    dose: baseDose,
    message: `Ti consigliamo una dose di circa ${baseDose}mg di THC. Inizia con meno se non sei sicuro.`,
  });
}
