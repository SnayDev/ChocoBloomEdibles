// /api/calc-dose.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { tried, smoke, intensity, age } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OpenAI API key' });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Agisci come un esperto di edibles al THC. Riceverai info su esperienza, uso e desiderio d'intensità, e dovrai restituire una dose consigliata in mg di THC."
          },
          {
            role: "user",
            content: `Ho provato THC: ${tried}, fumo: ${smoke}, voglio sentirlo: ${intensity}, età: ${age}`
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    const reply = data?.choices?.[0]?.message?.content || "Non riesco a calcolare una dose al momento.";
    const dose = parseInt(reply.match(/\d+/)?.[0] || "50");

    res.status(200).json({ dose, note: reply });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Errore interno durante la richiesta a OpenAI." });
  }
}
