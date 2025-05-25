import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { tried, smoke, intensity, age } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  const openai = new OpenAIApi(configuration);

  const prompt = `
Sei un assistente per chi consuma edibles. L'utente ti ha dato queste info:
- THC provato: ${tried}
- Fuma: ${smoke}
- Intensità desiderata: ${intensity}
- Età: ${age}

Basandoti su questo, consiglia una dose in mg di THC (massimo 1000mg, minimo 5mg). La risposta deve essere in questo formato JSON:
{
  "dose": numero intero,
  "note": frase di accompagnamento
}
Solo il JSON, senza testo extra.
`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Sei un esperto di cannabis edibles, fornisci solo JSON in risposta.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7
    });

    const reply = completion.data.choices[0].message.content.trim();
    const parsed = JSON.parse(reply);

    res.status(200).json(parsed);
  } catch (err) {
    console.error('Errore OpenAI:', err);
    res.status(500).json({ error: 'Errore nel calcolo con BloomBot.' });
  }
}
