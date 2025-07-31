/* ===== Navegación móvil ===== */
const btnMenu  = document.getElementById('btnMenu');
const navLinks = document.getElementById('navLinks');

btnMenu.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  btnMenu.classList.toggle('active');
});

/* Cierra el menú al hacer clic en un enlace */
navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    if (navLinks.classList.contains('open')){
      navLinks.classList.remove('open');
      btnMenu.classList.remove('active');
    }
  })
);
