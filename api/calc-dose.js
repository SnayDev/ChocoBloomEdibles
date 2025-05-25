import { Configuration, OpenAIApi } from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { tried, smoke, intensity, age } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OpenAI API key" });
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const userMessage = `
    Un utente ha risposto:
    - Ha mai provato THC? ${tried}
    - Fuma cannabis? ${smoke}
    - Quanto vuole sentire l'effetto? ${intensity}
    - Età: ${age}

    In base a queste informazioni, consiglia in modo chiaro e conciso una dose ideale in mg di THC, spiegando il perché. Rispondi in modo empatico, amichevole ma responsabile. Usa al massimo 3 frasi.
  `;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Sei un assistente esperto di cannabis responsabile e amichevole." },
        { role: "user", content: userMessage }
      ],
      max_tokens: 200,
      temperature: 0.8
    });

    const reply = completion.data.choices[0].message.content;

    return res.status(200).json({
      dose: 0, // opzionale, se vuoi estrarre numeri dal testo puoi farlo più avanti
      note: reply
    });
  } catch (err) {
    console.error("OpenAI API Error", err);
    return res.status(500).json({ error: "OpenAI API Error", details: err });
  }
}
