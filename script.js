
function acceptAge() {
    document.getElementById('age-verification').style.display = 'none';
    localStorage.setItem('is21', 'true');
}
function denyAge() {
    window.location.href = 'https://www.google.com';
}
window.onload = function() {
    if (localStorage.getItem('is21') !== 'true') {
        document.getElementById('age-verification').style.display = 'flex';
    } else {
        document.getElementById('age-verification').style.display = 'none';
    }
}
