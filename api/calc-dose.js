export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { tried, smoke, intensity, age } = req.body;

  if (!tried || !smoke || !intensity || !age) {
    return res.status(400).json({ error: "Missing input fields" });
  }

  let score = 0;

  if (tried === 'no') score += 0;
  else if (tried === 'occasionally') score += 1;
  else if (tried === 'often') score += 2;
  else if (tried === 'daily') score += 3;

  if (smoke === 'daily') score += 3;
  else if (smoke === 'weekend') score += 1;

  if (intensity === 'light') score += 0;
  else if (intensity === 'balanced') score += 2;
  else if (intensity === 'strong') score += 4;

  if (age === '18') score += 1;
  else if (age === '21') score += 2;
  else if (age === '30') score += 3;
  else if (age === '40') score += 2;
  else if (age === '60') score += 1;

  let dose = 50;
  if (score <= 3) dose = 50;
  else if (score <= 5) dose = 100;
  else if (score <= 8) dose = 150;
  else if (score <= 11) dose = 200;
  else if (score <= 14) dose = 300;
  else if (score <= 16) dose = 400;
  else dose = 500;

  dose = Math.round(dose / 50) * 50;
  dose = Math.min(1000, dose);

  res.status(200).json({ dose });
}
