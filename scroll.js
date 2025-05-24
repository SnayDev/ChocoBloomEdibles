// FADEIN SU SCROLL
function handleFadeIn() {
  const faders = document.querySelectorAll('.fadein');
  const windowBottom = window.scrollY + window.innerHeight;

  faders.forEach(el => {
    const rect = el.getBoundingClientRect();
    const elTop = rect.top + window.scrollY;
    if (windowBottom > elTop + 48) {
      el.classList.add('fadein-visible');
    }
  });
}

// HAMBURGER MENU
function toggleMenu() {
  document.getElementById("sideMenu").classList.toggle("show");
}

// AGE GATE PERSISTENTE
function showAgeGateIfNeeded() {
  const ageGate = document.getElementById('age-gate');
  // se già accettato, non mostrare
  if (localStorage.getItem('chocobloom_age_ok') === 'yes') {
    ageGate.style.display = 'none';
  } else {
    ageGate.style.display = 'flex';
  }
}
function enterSite(confirmed) {
  if (confirmed) {
    localStorage.setItem('chocobloom_age_ok', 'yes');
    document.getElementById('age-gate').style.display = 'none';
  } else {
    localStorage.removeItem('chocobloom_age_ok');
    document.body.innerHTML = "<h2 style='color: white; text-align:center; margin-top:20%'>Accesso negato</h2>";
  }
}

// SPLASH SCREEN
function splashSequence() {
  const splash = document.getElementById('splash-screen');
  setTimeout(() => {
    splash.classList.add("fade-out");
    setTimeout(() => {
      splash.style.display = 'none';
      showAgeGateIfNeeded();
    }, 1000);
  }, 1500);
}

// LOGO CLICK = HOME o age gate
function logoClickHandler(e) {
  // Se c'è age gate già accettato, vai alla home senza popup
  if (localStorage.getItem('chocobloom_age_ok') === 'yes') {
    window.location.href = 'index.html';
  } else {
    document.getElementById('age-gate').style.display = 'flex';
    e.preventDefault();
  }
}

// INIT
document.addEventListener("DOMContentLoaded", function () {
  // Splash + age gate
  if (document.getElementById('splash-screen')) splashSequence();

  // Fade in su scroll
  handleFadeIn();
  window.addEventListener('scroll', handleFadeIn);
  window.addEventListener('resize', handleFadeIn);

  // Logo click
  const logo = document.querySelector('.navbar-logo-center a');
  if (logo) {
    logo.addEventListener('click', logoClickHandler);
  }
  // Hamburger per mobile (già globale)
  window.toggleMenu = toggleMenu;
  window.enterSite = enterSite;
});
