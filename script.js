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

// ================= FORO DE DISCUSIÓN (Supabase) =================
// CÓMO SE MANEJA (para Jader / Dayla):
// - El foro guarda temas y comentarios en Supabase (cuenta gratuita de Dayla).
//   Para ACTIVARLO: pegar la URL del proyecto entre las comillas de FORO_URL
//   y la clave pública "anon" en FORO_ANON (panel de Supabase: Settings > API).
//   La clave "anon" es pública por diseño; la seguridad la dan las reglas
//   (RLS) de la base de datos que crea el archivo foro-supabase.txt.
// - Dayla entra como administradora desde la misma sección del foro con su
//   correo y contraseña: aprueba o borra comentarios, responde con su nombre
//   y crea o elimina temas ahí mismo, sin tocar código.
// - Los visitantes comentan solo con un nombre o seudónimo; su comentario
//   queda "pendiente" hasta que Dayla lo aprueba.
const FORO_URL = "https://gvfuldcchlddvavxmgpb.supabase.co";
const FORO_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2ZnVsZGNjaGxkZHZhdnhtZ3BiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0MTIzOTEsImV4cCI6MjEwOTk4ODM5MX0.eRXp_S39BNfFLEUeIuAga3UioPAmuFFWnPXLQzt3vUE";
const FORO_ACTIVO = Boolean(FORO_URL && FORO_ANON);
const FORO_TEMAS_LOCALES = [
  {
    "id": "local-1",
    "titulo": "Distanciamiento emocional: cuando las parejas dejan de conectar, aunque sigan juntas",
    "intro": "¿Es posible amar a tu pareja y aun así sentirse solo dentro de la relación? El distanciamiento emocional llega en silencio: menos conversación, menos afecto, menos conexión. Con base en la investigación de John Gottman, exploro por qué sucede y cómo se trabaja en terapia. — Dayla",
    "slug": "distanciamiento-emocional",
    "imagen": "tema-distanciamiento-emocional.jpg"
  },
  {
    "id": "local-2",
    "titulo": "Después de una infidelidad: ¿es posible reconstruir la confianza y salvar la relación?",
    "intro": "Descubrir una infidelidad sacude todo: la confianza, la tranquilidad y el futuro. Algunas parejas terminan; otras intentan reconstruir. ¿Qué dice la investigación sobre cuándo es posible y qué se necesita? Un tema delicado, tratado con evidencia y sin fórmulas mágicas. — Dayla",
    "slug": "despues-de-una-infidelidad",
    "imagen": "tema-despues-de-una-infidelidad.jpg"
  },
  {
    "id": "local-3",
    "titulo": "Celos, redes sociales y desconfianza: los nuevos desafíos de las relaciones de pareja",
    "intro": "Un «me gusta», un mensaje, un seguidor nuevo… y estalla la discusión. Los celos digitales y la vigilancia en redes son de los conflictos más nuevos de las parejas. Revisamos qué dice la investigación y cómo poner límites sin caer en el control. — Dayla",
    "slug": "celos-redes-sociales-y-desconfianza",
    "imagen": "tema-celos-redes-sociales-y-desconfianza.jpg"
  }
];

(function initForo() {
  const grid = document.getElementById('foro-temas');
  if (!grid) return;
  const hilo = document.getElementById('foro-hilo');
  const hiloTitulo = document.getElementById('foro-hilo-titulo');
  const hiloCuerpo = document.getElementById('foro-hilo-cuerpo');
  const adminBar = document.getElementById('foro-admin');
  const pendientesBox = document.getElementById('foro-pendientes');
  let token = sessionStorage.getItem('foro_admin_token') || '';
  let temaActual = null;

  function el(tag, cls, texto) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texto != null) n.textContent = texto;
    return n;
  }
  function api(path, opciones) {
    const headers = Object.assign({
      'apikey': FORO_ANON,
      'Authorization': 'Bearer ' + (token || FORO_ANON),
      'Content-Type': 'application/json'
    }, (opciones && opciones.headers) || {});
    return fetch(FORO_URL + path, Object.assign({}, opciones, { headers: headers }));
  }
  function fmtFecha(iso) {
    try {
      return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) { return ''; }
  }

  // ---------- Temas ----------
  function pintarTemas(temas) {
    grid.innerHTML = '';
    temas.forEach((t) => {
      const card = el('article', 'foro-card');
      if (t.imagen) {
        const img = document.createElement('img');
        img.className = 'foro-card-img';
        img.src = '/' + t.imagen;
        img.alt = 'Ilustración del tema: ' + t.titulo;
        img.loading = 'lazy';
        card.appendChild(img);
      }
      card.appendChild(el('p', 'foro-meta', 'Tema de Dayla Sánchez · Psicóloga'));
      card.appendChild(el('h3', null, t.titulo));
      card.appendChild(el('p', null, t.intro || ''));
      if (FORO_ACTIVO && t.slug) {
        const a = el('a', 'foro-open', 'Leer el tema y comentar');
        a.href = 'foro/' + t.slug;
        card.appendChild(a);
      } else {
        const btn = el('button', 'foro-open', 'Ver discusión y comentar');
        btn.type = 'button';
        btn.addEventListener('click', () => abrirTema(t, card));
        card.appendChild(btn);
      }
      if (token && FORO_ACTIVO) {
        const del = el('button', 'foro-mini foro-del', 'Eliminar tema');
        del.type = 'button';
        del.addEventListener('click', async () => {
          if (!confirm('¿Eliminar el tema «' + t.titulo + '» con todos sus comentarios?')) return;
          await api('/rest/v1/foro_temas?id=eq.' + t.id, { method: 'DELETE' });
          hilo.hidden = true;
          cargarTemas();
        });
        card.appendChild(del);
      }
      grid.appendChild(card);
    });
    if (!temas.length) {
      grid.appendChild(el('p', 'foro-vacio', 'Todavía no hay temas publicados.'));
    }
  }
  async function cargarTemas() {
    if (!FORO_ACTIVO) { pintarTemas(FORO_TEMAS_LOCALES); return; }
    try {
      const r = await api('/rest/v1/foro_temas?select=*&order=creado_en.asc');
      const temas = await r.json();
      pintarTemas(Array.isArray(temas) ? temas : FORO_TEMAS_LOCALES);
    } catch (e) { pintarTemas(FORO_TEMAS_LOCALES); }
  }


  function cajaServicio(t) {
    const box = el('div', 'foro-cta');
    box.appendChild(el('p', 'foro-cta-titulo', '¿Te identificas con este tema?'));
    box.appendChild(el('p', null, 'Hablarlo entre ustedes es el primer paso; trabajarlo con acompañamiento profesional lo hace mucho más llevadero. En mi terapia de pareja online los acompaño a comprender qué les está pasando, sanar lo que duele y construir una relación más sana, en sesiones de 60 minutos por videollamada.'));
    const a = el('a', 'btn btn-whatsapp', 'Quiero terapia de pareja');
    a.target = '_blank'; a.rel = 'noopener';
    a.href = 'https://wa.me/573163999108?text=' + encodeURIComponent('Hola Dayla, leí el tema del foro «' + t.titulo + '» y quiero información sobre la terapia de pareja.');
    box.appendChild(a);
    return box;
  }
  function pintarApertura(t) {
    const texto = (t.contenido && t.contenido.trim()) ? t.contenido : t.intro;
    if (!texto) return null;
    const art = el('article', 'foro-apertura');
    art.appendChild(el('p', 'foro-meta', 'Tema abierto por Dayla Sánchez · Psicóloga'));
    texto.split(/\n\n+/).forEach((par) => {
      const limpio = par.trim();
      if (!limpio) return;
      if (limpio.length <= 110 && !/[.]$/.test(limpio) && !/^\d+[.)]/.test(limpio) && limpio.indexOf('http') === -1) art.appendChild(el('h3', 'foro-h3', limpio));
      else art.appendChild(el('p', 'foro-apertura-p', limpio));
    });
    return art;
  }

  // ---------- Hilo de un tema ----------
  async function abrirTema(t, card) {
    document.querySelectorAll('.foro-card.active').forEach((c) => c.classList.remove('active'));
    if (card) card.classList.add('active');
    temaActual = t;
    hilo.hidden = false;
    hiloTitulo.textContent = t.titulo;
    hiloCuerpo.innerHTML = '';
    if (!FORO_ACTIVO) {
      const wrap = el('div', 'foro-pending');
      wrap.appendChild(el('p', null, 'Los comentarios de este tema se están activando. Mientras tanto, puedes contarme tu situación directamente:'));
      const a = el('a', 'btn btn-whatsapp', 'Contarlo por WhatsApp');
      a.target = '_blank'; a.rel = 'noopener';
      a.href = 'https://wa.me/573163999108?text=' + encodeURIComponent('Hola Dayla, quiero contar mi situación sobre el tema del foro: ' + t.titulo);
      wrap.appendChild(a);
      const ap1 = pintarApertura(t);
      if (ap1) hiloCuerpo.appendChild(ap1);
      hiloCuerpo.appendChild(wrap);
      hiloCuerpo.appendChild(cajaServicio(t));
      hilo.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const ap2 = pintarApertura(t);
    if (ap2) hiloCuerpo.appendChild(ap2);
    const lista = el('div', 'foro-lista');
    lista.appendChild(el('p', 'foro-cargando', 'Cargando la conversación…'));
    hiloCuerpo.appendChild(lista);
    const form = construirFormComentario(t);
    hiloCuerpo.appendChild(form);
    hiloCuerpo.appendChild(cajaServicio(t));
    await cargarComentarios(t, lista);
    hilo.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function cargarComentarios(t, lista) {
    try {
      const r = await api('/rest/v1/foro_comentarios?tema_id=eq.' + t.id + '&estado=eq.aprobado&select=*&order=creado_en.asc');
      const comentarios = await r.json();
      lista.innerHTML = '';
      if (!Array.isArray(comentarios) || !comentarios.length) {
        lista.appendChild(el('p', 'foro-vacio', 'Todavía no hay comentarios aprobados. Sé la primera persona en contar su situación.'));
        return;
      }
      comentarios.forEach((c) => lista.appendChild(pintarComentario(c, t, lista)));
    } catch (e) {
      lista.innerHTML = '';
      lista.appendChild(el('p', 'foro-vacio', 'No se pudo cargar la conversación. Intenta de nuevo en un momento.'));
    }
  }

  function pintarComentario(c, t, lista) {
    const box = el('div', 'foro-comentario' + (c.es_admin ? ' es-admin' : ''));
    const head = el('div', 'foro-comentario-head');
    head.appendChild(el('strong', null, c.es_admin ? 'Dayla Sánchez' : c.nombre));
    if (c.es_admin) head.appendChild(el('span', 'foro-badge', 'Psicóloga'));
    head.appendChild(el('span', 'foro-fecha', fmtFecha(c.creado_en)));
    box.appendChild(head);
    box.appendChild(el('p', 'foro-texto', c.mensaje));
    if (token) {
      const del = el('button', 'foro-mini foro-del', 'Borrar');
      del.type = 'button';
      del.addEventListener('click', async () => {
        if (!confirm('¿Borrar este comentario?')) return;
        await api('/rest/v1/foro_comentarios?id=eq.' + c.id, { method: 'DELETE' });
        cargarComentarios(t, lista);
      });
      box.appendChild(del);
    }
    return box;
  }

  function construirFormComentario(t) {
    const form = el('form', 'foro-form');
    const titulo = el('p', 'foro-form-titulo', token ? 'Responder como Dayla' : 'Cuenta tu situación');
    form.appendChild(titulo);
    let inputNombre = null;
    if (!token) {
      inputNombre = document.createElement('input');
      inputNombre.type = 'text';
      inputNombre.required = true;
      inputNombre.maxLength = 60;
      inputNombre.placeholder = 'Tu nombre o un seudónimo';
      inputNombre.className = 'foro-input';
      form.appendChild(inputNombre);
    }
    const area = document.createElement('textarea');
    area.required = true;
    area.maxLength = 1500;
    area.rows = 4;
    area.placeholder = token ? 'Escribe tu respuesta para este tema…' : 'Escribe aquí tu situación o tu comentario…';
    area.className = 'foro-input';
    form.appendChild(area);
    const trampa = document.createElement('input');
    trampa.type = 'text'; trampa.tabIndex = -1; trampa.autocomplete = 'off';
    trampa.style.display = 'none'; trampa.className = 'foro-hp';
    form.appendChild(trampa);
    const nota = el('p', 'foro-form-nota', token ? 'Tu respuesta se publica de inmediato con tu nombre.' : 'Tu comentario se publica cuando se apruebe.');
    form.appendChild(nota);
    const btn = el('button', 'btn btn-dark', token ? 'Publicar respuesta' : 'Enviar comentario');
    btn.type = 'submit';
    form.appendChild(btn);
    const aviso = el('p', 'foro-form-aviso');
    form.appendChild(aviso);
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (trampa.value) return;
      const nombre = token ? 'Dayla Sánchez' : inputNombre.value.trim();
      const mensaje = area.value.trim();
      if (!nombre || !mensaje) return;
      btn.disabled = true;
      aviso.textContent = 'Enviando…';
      try {
        const r = await api('/rest/v1/foro_comentarios', {
          method: 'POST',
          headers: { 'Prefer': 'return=minimal' },
          body: JSON.stringify({ tema_id: t.id, nombre: nombre, mensaje: mensaje, es_admin: Boolean(token), estado: token ? 'aprobado' : 'pendiente' })
        });
        if (!r.ok) throw new Error('post');
        area.value = '';
        if (inputNombre) inputNombre.value = '';
        aviso.textContent = token ? 'Respuesta publicada.' : '¡Gracias! Tu comentario quedó en revisión; lo leeré y lo aprobaré pronto.';
        if (token) {
          const lista = hiloCuerpo.querySelector('.foro-lista');
          if (lista) cargarComentarios(t, lista);
        }
      } catch (e) {
        aviso.textContent = 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.';
      }
      btn.disabled = false;
    });
    return form;
  }

  // ---------- Panel de administradora ----------
  function pintarAdmin() {
    if (!adminBar) return;
    adminBar.innerHTML = '';
    if (!FORO_ACTIVO) return;
    if (!token) {
      // Sin sesión no se muestra ningún botón: Dayla ingresa por su página
      // privada /acceso (sin enlaces desde el sitio; la guarda en favoritos).
      return;
    }
    adminBar.appendChild(el('span', 'foro-admin-ok', 'Sesión de administradora activa'));
    const btnPend = el('button', 'foro-mini', 'Ver comentarios por aprobar');
    btnPend.type = 'button';
    btnPend.addEventListener('click', () => {
      pendientesBox.hidden = !pendientesBox.hidden;
      if (!pendientesBox.hidden) cargarPendientes();
    });
    adminBar.appendChild(btnPend);
    const btnTema = el('button', 'foro-mini', '＋ Nuevo tema');
    btnTema.type = 'button';
    btnTema.addEventListener('click', () => {
      pendientesBox.hidden = false;
      pendientesBox.innerHTML = '';
      const form = el('form', 'foro-login');
      const tit = document.createElement('input');
      tit.type = 'text'; tit.required = true; tit.maxLength = 90; tit.placeholder = 'Título del tema'; tit.className = 'foro-input';
      const intro = document.createElement('textarea');
      intro.maxLength = 400; intro.rows = 3; intro.placeholder = 'Texto de apertura del tema (lo que Dayla escribe para abrir la conversación)'; intro.className = 'foro-input';
      const crear = el('button', 'btn btn-dark', 'Crear tema');
      crear.type = 'submit';
      form.appendChild(tit); form.appendChild(intro); form.appendChild(crear);
      form.addEventListener('submit', async (ev) => {
        ev.preventDefault();
        const r = await api('/rest/v1/foro_temas', {
          method: 'POST',
          headers: { 'Prefer': 'return=minimal' },
          body: JSON.stringify({ titulo: tit.value.trim(), intro: intro.value.trim(), slug: tit.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) })
        });
        if (r.ok) { pendientesBox.hidden = true; cargarTemas(); }
      });
      pendientesBox.appendChild(form);
    });
    adminBar.appendChild(btnTema);
    const btnSalir = el('button', 'foro-mini', 'Salir');
    btnSalir.type = 'button';
    btnSalir.addEventListener('click', () => {
      token = '';
      sessionStorage.removeItem('foro_admin_token');
      if (pendientesBox) pendientesBox.hidden = true;
      pintarAdmin(); cargarTemas();
      if (temaActual) abrirTema(temaActual, null);
    });
    adminBar.appendChild(btnSalir);
  }

  async function cargarPendientes() {
    if (!pendientesBox || !token) return;
    pendientesBox.innerHTML = '';
    pendientesBox.appendChild(el('h3', null, 'Comentarios por aprobar'));
    try {
      const r = await api('/rest/v1/foro_comentarios?estado=eq.pendiente&select=*,foro_temas(titulo)&order=creado_en.asc');
      const lista = await r.json();
      if (!Array.isArray(lista) || !lista.length) {
        pendientesBox.appendChild(el('p', 'foro-vacio', 'No hay comentarios pendientes. 🎉'));
        return;
      }
      lista.forEach((c) => {
        const box = el('div', 'foro-comentario');
        const head = el('div', 'foro-comentario-head');
        head.appendChild(el('strong', null, c.nombre));
        head.appendChild(el('span', 'foro-fecha', (c.foro_temas ? c.foro_temas.titulo + ' · ' : '') + fmtFecha(c.creado_en)));
        box.appendChild(head);
        box.appendChild(el('p', 'foro-texto', c.mensaje));
        const ok = el('button', 'foro-mini foro-ok', 'Aprobar y publicar');
        ok.type = 'button';
        ok.addEventListener('click', async () => {
          await api('/rest/v1/foro_comentarios?id=eq.' + c.id, { method: 'PATCH', headers: { 'Prefer': 'return=minimal' }, body: JSON.stringify({ estado: 'aprobado' }) });
          cargarPendientes();
          if (temaActual && temaActual.id === c.tema_id) {
            const lista2 = hiloCuerpo.querySelector('.foro-lista');
            if (lista2) cargarComentarios(temaActual, lista2);
          }
        });
        const del = el('button', 'foro-mini foro-del', 'Borrar');
        del.type = 'button';
        del.addEventListener('click', async () => {
          if (!confirm('¿Borrar este comentario pendiente?')) return;
          await api('/rest/v1/foro_comentarios?id=eq.' + c.id, { method: 'DELETE' });
          cargarPendientes();
        });
        box.appendChild(ok); box.appendChild(del);
        pendientesBox.appendChild(box);
      });
    } catch (e) {
      pendientesBox.appendChild(el('p', 'foro-vacio', 'No se pudieron cargar los pendientes.'));
    }
  }

// Si Dayla llega desde el correo de invitación o de recuperación de Supabase,
  // el enlace trae su token en la URL: se le muestra el formulario para crear
  // su contraseña de administradora (ninguna contraseña pasa por el chat).
  (function revisarEnlaceAdmin() {
    if (!FORO_ACTIVO || !adminBar) return;
    const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
    const tipo = hash.get('type');
    const tk = hash.get('access_token');
    if ((tipo !== 'invite' && tipo !== 'recovery') || !tk) return;
    token = tk;
    adminBar.innerHTML = '';
    adminBar.appendChild(el('p', 'foro-form-titulo', 'Bienvenida, Dayla: crea tu contraseña del foro'));
    const form = el('form', 'foro-login');
    const p1 = document.createElement('input');
    p1.type = 'password'; p1.required = true; p1.minLength = 8;
    p1.placeholder = 'Tu nueva contraseña (mínimo 8 caracteres)'; p1.className = 'foro-input';
    const btn = el('button', 'btn btn-dark', 'Guardar contraseña');
    btn.type = 'submit';
    const aviso = el('p', 'foro-form-aviso');
    form.appendChild(p1); form.appendChild(btn); form.appendChild(aviso);
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      aviso.textContent = 'Guardando…';
      try {
        const r = await fetch(FORO_URL + '/auth/v1/user', {
          method: 'PUT',
          headers: { 'apikey': FORO_ANON, 'Authorization': 'Bearer ' + tk, 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: p1.value })
        });
        if (!r.ok) throw new Error('setpass');
        sessionStorage.setItem('foro_admin_token', tk);
        history.replaceState(null, '', location.pathname);
        aviso.textContent = 'Contraseña guardada. Ya estás dentro como administradora.';
        pintarAdmin(); cargarTemas(); cargarPendientes();
      } catch (e) {
        aviso.textContent = 'No se pudo guardar. Pídele a Jader que te reenvíe la invitación.';
      }
    });
    adminBar.appendChild(form);
  })();

  pintarAdmin();
  cargarTemas();
})();
