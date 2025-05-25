export default async function handler(req, res) {
  const body = await req.json();
  const { tried, smoke, intensity, age } = body;

  const messages = [
    {
      role: "system",
      content: "Agisci come un assistente esperto di edibles al THC chiamato BloomBot. Rispondi in modo preciso, pratico, e sicuro. Rispondi in massimo 2 frasi."
    },
    {
      role: "user",
      content: `Ho ${age} anni. Ho provato THC: ${tried}. Fumo cannabis: ${smoke}. Voglio un effetto: ${intensity}. Cosa mi consigli?`
    }
  ];

  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.7,
        max_tokens: 150
      })
    });

    const data = await completion.json();
    const reply = data.choices?.[0]?.message?.content || "Errore nella risposta";

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: "Errore server", detail: err.message });
  }
}
