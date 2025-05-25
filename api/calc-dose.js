export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { tried, smoke, intensity, age } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OpenAI API Key' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Agisci come un esperto di edibles THC. Restituisci solo un numero (mg) e un messaggio umano, in italiano.'
          },
          {
            role: 'user',
            content: `Ho provato THC: ${tried}, fumo: ${smoke}, voglio sentirlo: ${intensity}, età: ${age}`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error", data);
      return res.status(500).json({ error: "OpenAI API Error", details: data });
    }

    const reply = data.choices?.[0]?.message?.content || '';
    const dose = parseInt(reply.match(/\d+/)?.[0]) || 50;

    return res.status(200).json({
      dose,
      note: reply
    });

  } catch (err) {
    console.error("Server error", err);
    return res.status(500).json({ error: 'Errore interno del server.' });
  }
}
