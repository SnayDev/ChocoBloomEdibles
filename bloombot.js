document.getElementById("ai-agent-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const form = e.target;

  // Reset UI
  const thinking = document.getElementById("ai-thinking");
  const result = document.getElementById("ai-agent-result");
  result.textContent = '';
  thinking.style.display = 'block';

  const body = {
    tried: form['ai-tried'].value,
    smoke: form['ai-smoke'].value,
    intensity: form['ai-intensity'].value,
    age: form['ai-age'].value
  };

  try {
    const res = await fetch('/api/calc-dose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    // Optional: anima la risposta
    await new Promise(resolve => setTimeout(resolve, 800));
    result.textContent = data.message;
  } catch (err) {
    result.textContent = 'Errore durante la richiesta. Riprova.';
  }

  thinking.style.display = 'none';
});
