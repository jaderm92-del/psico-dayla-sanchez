// Página individual de un tema del foro (/foro/<tema>)
// Usa la misma conexión de Supabase definida en script.js (FORO_URL / FORO_ANON).
(function initTema() {
  const tituloEl = document.getElementById('tema-titulo');
  if (!tituloEl) return;
  const cuerpo = document.getElementById('tema-cuerpo');
  const imagen = document.getElementById('tema-imagen');
  let token = sessionStorage.getItem('foro_admin_token') || '';

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
    try { return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }); }
    catch (e) { return ''; }
  }
  function esEncabezado(p) {
    const t = p.trim();
    return t.length <= 110 && !/[.]$/.test(t);
  }
  function pintarApertura(t) {
    const texto = (t.contenido && t.contenido.trim()) ? t.contenido : t.intro;
    if (!texto) return null;
    const art = el('article', 'foro-apertura');
    art.appendChild(el('p', 'foro-meta', 'Tema abierto por Dayla Sánchez · Psicóloga'));
    texto.split(/\n\n+/).forEach((par) => {
      const limpio = par.trim();
      if (!limpio) return;
      if (esEncabezado(limpio)) art.appendChild(el('h3', 'foro-h3', limpio));
      else art.appendChild(el('p', 'foro-apertura-p', limpio));
    });
    return art;
  }
  function cajaServicio(t) {
    const box = el('div', 'foro-cta');
    box.appendChild(el('p', 'foro-cta-titulo', '¿Te identificas con este tema?'));
    box.appendChild(el('p', null, 'Hablarlo entre ustedes es el primer paso; trabajarlo con acompañamiento profesional lo hace mucho más llevadero. En la terapia de pareja online con Dayla Sánchez podrán comprender qué les está pasando, sanar lo que duele y construir una relación más sana, en sesiones de 60 minutos por videollamada.'));
    const a = el('a', 'btn btn-whatsapp', 'Quiero terapia de pareja');
    a.target = '_blank'; a.rel = 'noopener';
    a.href = 'https://wa.me/573163999108?text=' + encodeURIComponent('Hola Dayla, leí el tema del foro «' + t.titulo + '» y quiero información sobre la terapia de pareja.');
    box.appendChild(a);
    return box;
  }

  const params = new URLSearchParams(location.search);
  let slug = params.get('tema');
  if (!slug) {
    const partes = location.pathname.split('/').filter(Boolean);
    slug = partes[partes.length - 1] || '';
  }

  async function cargar() {
    if (!slug || typeof FORO_URL === 'undefined' || !FORO_URL) {
      tituloEl.textContent = 'Tema no encontrado';
      cuerpo.appendChild(el('p', 'foro-vacio', 'Este tema no existe o fue retirado. Vuelve al foro para ver los temas disponibles.'));
      return;
    }
    try {
      const r = await api('/rest/v1/foro_temas?slug=eq.' + encodeURIComponent(slug) + '&select=*');
      const temas = await r.json();
      if (!Array.isArray(temas) || !temas.length) throw new Error('sin tema');
      const t = temas[0];
      document.title = t.titulo + ' · Foro de Dayla Sánchez, psicóloga';
      tituloEl.textContent = t.titulo;
      if (t.imagen) {
        imagen.src = '/' + t.imagen;
        imagen.alt = 'Ilustración del tema: ' + t.titulo;
        imagen.hidden = false;
      }
      const ap = pintarApertura(t);
      if (ap) cuerpo.appendChild(ap);
      const lista = el('div', 'foro-lista');
      lista.appendChild(el('p', 'foro-cargando', 'Cargando la conversación…'));
      cuerpo.appendChild(lista);
      cuerpo.appendChild(construirForm(t, lista));
      cuerpo.appendChild(cajaServicio(t));
      await cargarComentarios(t, lista);
    } catch (e) {
      tituloEl.textContent = 'Tema no encontrado';
      cuerpo.appendChild(el('p', 'foro-vacio', 'Este tema no existe o fue retirado. Vuelve al foro para ver los temas disponibles.'));
    }
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
      comentarios.forEach((c) => {
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
        lista.appendChild(box);
      });
    } catch (e) {
      lista.innerHTML = '';
      lista.appendChild(el('p', 'foro-vacio', 'No se pudo cargar la conversación. Intenta de nuevo en un momento.'));
    }
  }

  function construirForm(t, lista) {
    const form = el('form', 'foro-form');
    form.appendChild(el('p', 'foro-form-titulo', token ? 'Responder como Dayla' : 'Cuenta tu situación'));
    let inputNombre = null;
    if (!token) {
      inputNombre = document.createElement('input');
      inputNombre.type = 'text'; inputNombre.required = true; inputNombre.maxLength = 60;
      inputNombre.placeholder = 'Tu nombre o un seudónimo'; inputNombre.className = 'foro-input';
      form.appendChild(inputNombre);
    }
    const area = document.createElement('textarea');
    area.required = true; area.maxLength = 1500; area.rows = 4;
    area.placeholder = token ? 'Escribe tu respuesta para este tema…' : 'Escribe aquí tu situación o tu comentario…';
    area.className = 'foro-input';
    form.appendChild(area);
    const trampa = document.createElement('input');
    trampa.type = 'text'; trampa.tabIndex = -1; trampa.autocomplete = 'off';
    trampa.style.display = 'none';
    form.appendChild(trampa);
    form.appendChild(el('p', 'foro-form-nota', token ? 'Tu respuesta se publica de inmediato con tu nombre.' : 'Tu comentario se publica apenas Dayla lo apruebe. No compartas datos personales.'));
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
        if (token) cargarComentarios(t, lista);
      } catch (e) {
        aviso.textContent = 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.';
      }
      btn.disabled = false;
    });
    return form;
  }

  cargar();
})();
