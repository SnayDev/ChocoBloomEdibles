document.getElementById('ai-agent-form').addEventListener('submit', async function(e){
  e.preventDefault();
  const aiThinking = document.getElementById('ai-thinking');
  const resultEl = document.getElementById('ai-agent-result');
  resultEl.style.display = "none";
  aiThinking.style.display = "block";

  const payload = {
    tried: e.target['ai-tried'].value,
    smoke: e.target['ai-smoke'].value,
    intensity: e.target['ai-intensity'].value,
    age: e.target['ai-age'].value
  };

  try {
    const res = await fetch("https://TUO-PROGETTO.vercel.app/api/calc-dose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data || !data.dose) throw new Error("Errore di risposta");

    const dose = data.dose;
    const pezzi = dose / 200;
    const displayPezzi = (pezzi % 1 === 0) ? `${pezzi}` : `${Math.round(pezzi * 4) / 4}`;
    const grammi = pezzi * 10;

    resultEl.innerHTML = `BloomBot consiglia: <b>${dose}mg THC</b><br>≈ ${displayPezzi} cioccolatino/i (${grammi}g)`;
    document.getElementById('dose-slider').value = dose;
    aggiornaEffettiDose(dose);
    aiThinking.style.display = "none";
    resultEl.style.display = "";
  } catch (err) {
    resultEl.innerHTML = "Errore nel calcolo. Riprova.";
    aiThinking.style.display = "none";
    resultEl.style.display = "";
  }
});

function aggiornaEffettiDose(val) {
  document.getElementById('slider-dose-label').textContent = val + "mg";
  let desc = "";
  val = parseInt(val);
  const slider = document.getElementById('dose-slider');
  slider.style.setProperty('--glow', val >= 400 ? '#ff00cc' : val >= 200 ? '#ff99cc' : '#aaa');
  if(val <= 50) desc = "Effetto lieve, adatto a principianti.";
  else if(val <= 150) desc = "Effetto moderato, piacevole per la maggior parte degli utenti.";
  else if(val <= 400) desc = "Effetto intenso, solo per utenti esperti.";
  else if(val <= 700) desc = "Dose elevata: effetto molto forte, attenzione!";
  else desc = "Dose massiva: solo per tolleranza altissima. Rischio effetti collaterali!";
  document.getElementById('slider-effetti-descrizione').textContent = desc;
}
