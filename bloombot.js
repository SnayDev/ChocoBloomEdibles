document.getElementById("ai-agent-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const form = e.target;
  document.getElementById("ai-agent-result").textContent = '';
  document.getElementById("ai-thinking").style.display = 'block';

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
    document.getElementById("ai-agent-result").textContent = data.message;
  } catch (err) {
    document.getElementById("ai-agent-result").textContent = 'Errore nel calcolo della dose.';
  }

  document.getElementById("ai-thinking").style.display = 'none';
});
