import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { tried, smoke, intensity, age } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing OpenAI API Key' });
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const prompt = `
Sei un esperto di cannabis edibles e devi consigliare una dose iniziale di THC in mg a un utente con queste caratteristiche:
- Ha mai provato THC? ${tried}
- Fuma cannabis? ${smoke}
- Intensità desiderata: ${intensity}
- Età: ${age}

Rispondi con tono amichevole, in italiano, indicando i mg consigliati e una nota di contesto sulla scelta. Non superare i 300mg.
Restituisci solo la dose numerica e una spiegazione umana. Esempio:
"Ti consiglio di iniziare con 25mg di THC. È una dose soft, adatta a chi ha poca esperienza."`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 120,
    });

    const responseText = completion.data.choices[0].message.content.trim();

    return res.status(200).json({
      message: responseText,
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return res.status(500).json({ error: 'OpenAI API Error', details: error.message });
  }
}
