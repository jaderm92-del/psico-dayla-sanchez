// Animación de aparición al bajar (scroll reveal)
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Header con fondo al hacer scroll
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Menú móvil
const toggle = document.getElementById('navToggle');
const nav = document.querySelector('.main-nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));

// (El movimiento del hero lo da el video de fondo y el efecto Ken Burns de la foto)

// Video de fondo: al poder reproducirse, se retira la foto de respaldo;
// si el video no carga, se retira el video y queda la foto con efecto Ken Burns
const video = document.querySelector('.hero-video');
const fallback = document.querySelector('.hero-fallback');
if (video) {
  video.addEventListener('canplay', () => { if (fallback) fallback.remove(); });
  const source = video.querySelector('source');
  const fail = () => video.remove();
  if (source) source.addEventListener('error', fail);
  video.addEventListener('error', fail);
  setTimeout(() => { if (video.readyState === 0) video.remove(); }, 4000);
}
