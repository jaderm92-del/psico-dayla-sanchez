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
const FORO_URL = "";
const FORO_ANON = "";
const FORO_ACTIVO = Boolean(FORO_URL && FORO_ANON);
const FORO_TEMAS_LOCALES = [
  { id: "local-1", titulo: "Discutimos siempre por lo mismo", intro: "¿Les pasa que cada discusión, por distinta que empiece, termina en el mismo reclamo? Cuenten cómo es en su caso y qué han intentado. Los leo y les respondo. — Dayla" },
  { id: "local-2", titulo: "Ya no hablamos como antes", intro: "La distancia no siempre llega con una pelea: a veces llega en silencio, entre la rutina y el celular. Si sienten que la conversación se perdió, este es su espacio. — Dayla" },
  { id: "local-3", titulo: "Celos e inseguridad: ¿cómo manejarlos?", intro: "Los celos no siempre son falta de amor; muchas veces son miedo. Hablemos de cuándo son una señal para trabajar en pareja y de cómo abrir esa conversación sin que termine en pelea. — Dayla" }
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
      card.appendChild(el('p', 'foro-meta', 'Tema de Dayla Sánchez · Psicóloga'));
      card.appendChild(el('h3', null, t.titulo));
      card.appendChild(el('p', null, t.intro || ''));
      const btn = el('button', 'foro-open', 'Ver discusión y comentar');
      btn.type = 'button';
      btn.addEventListener('click', () => abrirTema(t, card));
      card.appendChild(btn);
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
      hiloCuerpo.appendChild(wrap);
      hilo.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const lista = el('div', 'foro-lista');
    lista.appendChild(el('p', 'foro-cargando', 'Cargando la conversación…'));
    hiloCuerpo.appendChild(lista);
    const form = construirFormComentario(t);
    hiloCuerpo.appendChild(form);
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
    const nota = el('p', 'foro-form-nota', token ? 'Tu respuesta se publica de inmediato con tu nombre.' : 'Tu comentario se publica apenas Dayla lo apruebe. No compartas datos personales.');
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
        aviso.textContent = token ? 'Respuesta publicada.' : '¡Gracias! Tu comentario quedó en revisión; Dayla lo leerá y lo aprobará pronto.';
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
      const btn = el('button', 'foro-mini', 'Acceso de Dayla (administradora)');
      btn.type = 'button';
      btn.addEventListener('click', () => {
        adminBar.innerHTML = '';
        const form = el('form', 'foro-login');
        const email = document.createElement('input');
        email.type = 'email'; email.required = true; email.placeholder = 'Correo de Dayla'; email.className = 'foro-input';
        const pass = document.createElement('input');
        pass.type = 'password'; pass.required = true; pass.placeholder = 'Contraseña'; pass.className = 'foro-input';
        const entrar = el('button', 'btn btn-dark', 'Ingresar');
        entrar.type = 'submit';
        const aviso = el('p', 'foro-form-aviso');
        form.appendChild(email); form.appendChild(pass); form.appendChild(entrar); form.appendChild(aviso);
        form.addEventListener('submit', async (ev) => {
          ev.preventDefault();
          aviso.textContent = 'Ingresando…';
          try {
            const r = await fetch(FORO_URL + '/auth/v1/token?grant_type=password', {
              method: 'POST',
              headers: { 'apikey': FORO_ANON, 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: email.value.trim(), password: pass.value })
            });
            const data = await r.json();
            if (!r.ok || !data.access_token) throw new Error('login');
            token = data.access_token;
            sessionStorage.setItem('foro_admin_token', token);
            pintarAdmin(); cargarTemas(); cargarPendientes();
            if (temaActual) abrirTema(temaActual, null);
          } catch (e) {
            aviso.textContent = 'No se pudo ingresar. Revisa el correo y la contraseña.';
          }
        });
        adminBar.appendChild(form);
      });
      adminBar.appendChild(btn);
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
          body: JSON.stringify({ titulo: tit.value.trim(), intro: intro.value.trim() })
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

  pintarAdmin();
  cargarTemas();
})();
