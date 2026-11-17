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

// (El video de la sección de terapia de pareja se reproduce solo, en silencio y en bucle)

// ================= FORO DE DISCUSIÓN =================
// CÓMO SE MANEJA (para Jader / Dayla):
// - Los temas del foro están en la lista FORO_TEMAS de aquí abajo.
//   AGREGAR un tema: copiar un bloque { ... }, pegarlo en la lista y cambiar
//   el id (sin espacios, sin tildes), el titulo y la intro.
//   QUITAR un tema: borrar su bloque de la lista.
// - Los comentarios funcionan con Cusdis (gratis, sin cuenta para comentar).
//   Cuando Dayla cree su cuenta en cusdis.com y registre esta página, pegar
//   el código "app-id" entre las comillas de FORO_APP_ID: los comentarios
//   quedan activos y Dayla modera y responde desde su panel de Cusdis
//   como administradora.
const FORO_APP_ID = "";
const FORO_TEMAS = [
  { id: "discutimos-siempre-por-lo-mismo", titulo: "Discutimos siempre por lo mismo", intro: "¿Les pasa que cada discusión, por distinta que empiece, termina en el mismo reclamo? Cuenten cómo es en su caso y qué han intentado. Los leo y les respondo. — Dayla" },
  { id: "ya-no-hablamos-como-antes", titulo: "Ya no hablamos como antes", intro: "La distancia no siempre llega con una pelea: a veces llega en silencio, entre la rutina y el celular. Si sienten que la conversación se perdió, este es su espacio. — Dayla" },
  { id: "celos-e-inseguridad", titulo: "Celos e inseguridad: ¿cómo manejarlos?", intro: "Los celos no siempre son falta de amor; muchas veces son miedo. Hablemos de cuándo son una señal para trabajar en pareja y de cómo abrir esa conversación sin que termine en pelea. — Dayla" }
];

(function initForo() {
  const grid = document.getElementById('foro-temas');
  if (!grid) return;
  const hilo = document.getElementById('foro-hilo');
  const hiloTitulo = document.getElementById('foro-hilo-titulo');
  const hiloCuerpo = document.getElementById('foro-hilo-cuerpo');

  FORO_TEMAS.forEach((t) => {
    const card = document.createElement('article');
    card.className = 'foro-card';
    const meta = document.createElement('p');
    meta.className = 'foro-meta';
    meta.textContent = 'Tema de Dayla Sánchez · Psicóloga';
    const h3 = document.createElement('h3');
    h3.textContent = t.titulo;
    const p = document.createElement('p');
    p.textContent = t.intro;
    const btn = document.createElement('button');
    btn.className = 'foro-open';
    btn.type = 'button';
    btn.textContent = 'Ver discusión y comentar';
    btn.addEventListener('click', () => abrirTema(t, card));
    card.appendChild(meta);
    card.appendChild(h3);
    card.appendChild(p);
    card.appendChild(btn);
    grid.appendChild(card);
  });

  function abrirTema(t, card) {
    document.querySelectorAll('.foro-card.active').forEach((c) => c.classList.remove('active'));
    card.classList.add('active');
    hilo.hidden = false;
    hiloTitulo.textContent = t.titulo;
    hiloCuerpo.innerHTML = '';
    if (FORO_APP_ID) {
      const div = document.createElement('div');
      div.id = 'cusdis_thread';
      div.setAttribute('data-host', 'https://cusdis.com');
      div.setAttribute('data-app-id', FORO_APP_ID);
      div.setAttribute('data-page-id', 'foro-' + t.id);
      div.setAttribute('data-page-url', location.origin + location.pathname + '#foro-' + t.id);
      div.setAttribute('data-page-title', t.titulo + ' · Foro de Dayla Sánchez');
      div.setAttribute('data-theme', 'light');
      hiloCuerpo.appendChild(div);
      const s = document.createElement('script');
      s.async = true;
      s.defer = true;
      s.src = 'https://cusdis.com/js/cusdis.es.js';
      document.body.appendChild(s);
    } else {
      const wrap = document.createElement('div');
      wrap.className = 'foro-pending';
      const p = document.createElement('p');
      p.textContent = 'Los comentarios de este tema se están activando. Mientras tanto, puedes contarme tu situación directamente:';
      const a = document.createElement('a');
      a.className = 'btn btn-whatsapp';
      a.target = '_blank';
      a.rel = 'noopener';
      a.href = 'https://wa.me/573163999108?text=' + encodeURIComponent('Hola Dayla, quiero contar mi situación sobre el tema del foro: ' + t.titulo);
      a.textContent = 'Contarlo por WhatsApp';
      wrap.appendChild(p);
      wrap.appendChild(a);
      hiloCuerpo.appendChild(wrap);
    }
    hilo.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
})();
