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
  { id: "local-1", titulo: "Discutimos siempre por lo mismo", intro: "¿Les pasa que cada discusión, por distinta que empiece, termina en el mismo reclamo? Cuenten cómo es en su caso y qué han intentado. Los leo y les respondo. — Dayla" },
  { id: "local-2", titulo: "Ya no hablamos como antes", intro: "La distancia no siempre llega con una pelea: a veces llega en silencio, entre la rutina y el celular. Si sienten que la conversación se perdió, este es su espacio. — Dayla" },
  { id: "local-3", titulo: "Celos e inseguridad: ¿cómo manejarlos?", intro: "Los celos no siempre son falta de amor; muchas veces son miedo. Hablemos de cuándo son una señal para trabajar en pareja y de cómo abrir esa conversación sin que termine en pelea. — Dayla" },
  { id: "local-4", titulo: "Juntos, pero cada uno en su pantalla", intro: "Están en la misma cama o en la misma mesa… y cada uno en su celular. Ignorar a la pareja por el teléfono se llama «phubbing» y la ciencia ya midió lo que enfría una relación. Les cuento qué dicen Gottman, Sue Johnson y los estudios más recientes, y cómo acordar un uso sano de las pantallas. — Dayla", contenido: "Les propongo una escena que quizá les suena: están acostados, cada uno a un lado de la cama, y los dos mirando el celular. O están cenando y uno cuenta algo de su día mientras el otro asiente sin levantar la vista de la pantalla. No hubo pelea, no hubo grito… pero algo se enfrió. Ese gesto tiene nombre y está muy estudiado.\n\nSe llama «phubbing» (de «phone», teléfono, y «snubbing», ignorar): es ignorar a la persona que tienes al frente por prestar atención al celular. James Roberts y Meredith David lo estudiaron en parejas en 2016 y encontraron que quien se siente ignorado por el teléfono de su pareja reporta más conflicto y menos satisfacción con la relación. Brandon McDaniel y Sarah Coyne hablaron ese mismo año de «tecnoferencia»: la tecnología interfiriendo en los momentos de pareja. La clave no es el aparato: es el mensaje que llega —«esto que tengo en la mano es más importante que tú»— repetido muchas veces al día.\n\nNo es una exageración de psicóloga: un metaanálisis publicado en 2025 en Frontiers in Psychology, que reunió 52 estudios con 19.698 personas, concluyó que a mayor phubbing, menor satisfacción, intimidad y cercanía, y más conflicto y celos en la pareja. Y el terreno está abonado: en Colombia pasamos en promedio 8 horas y 44 minutos diarios conectados a internet (DataReportal, 2025). La pantalla compite con la pareja todo el día, todos los días.\n\nEl psicólogo John Gottman, que ha estudiado parejas por más de cuarenta años, dice que las relaciones sólidas se construyen con micro-momentos: cada vez que tu pareja busca tu atención —un comentario, una mirada, una queja pequeña— puedes «volverte hacia» ella o darle la espalda. Levantar la vista del celular es, literalmente, volverse hacia el otro. Suena mínimo, pero esas respuestas repetidas son el cemento de la confianza.\n\nLa terapeuta Sue Johnson, creadora de la Terapia Focalizada en Emociones, lo resume en tres preguntas que toda pareja necesita poder responder con un sí: ¿estás Accesible para mí?, ¿Respondes cuando te busco?, ¿estás Emocionalmente conectado conmigo? El celular mal usado rompe las tres. Y Stan Tatkin habla de la «burbuja de pareja»: ese espacio protegido de dos. Un teléfono sin acuerdos es un tercero viviendo dentro de la burbuja.\n\nAquí aparece el primo incómodo del tema: los celos digitales. Revisar el celular del otro, exigir contraseñas, vigilar «en línea» y «vistos». Un estudio longitudinal de 2025 (Métellus y colaboradores) encontró que los celos por redes sociales alimentan la vigilancia electrónica y que la satisfacción de la pareja baja un año después. Conviene distinguir dos cosas: la privacidad es legítima —cada quien puede tener su espacio—; el secreto es otra cosa: lo que se oculta porque, si el otro supiera, dañaría la relación. Y una línea roja que digo sin rodeos: si la «revisión» viene con miedo, control o intimidación, ya no estamos hablando de comunicación sino de violencia, y eso se atiende de otra manera.\n\nSeñales para reconocerse: el celular está en la mesa durante las comidas; la última y la primera pantalla del día son el teléfono y no un «buenas noches» o un «buenos días»; las conversaciones importantes se interrumpen por «un segundo» que se vuelve diez minutos; uno de los dos ya dejó de contar cosas porque «nunca me está escuchando». Si marcaste más de una, este tema es para ustedes.\n\nLa buena noticia: esto no se arregla botando el celular por la ventana, sino con acuerdos concretos y rituales sin pantalla —la comida, la primera media hora al llegar, la cama— y, sobre todo, entendiendo qué necesidad hay detrás de cada reclamo. De eso se trata este espacio.\n\nCuéntenme en los comentarios: ¿en qué momento del día sienten más la pantalla entre ustedes? ¿Tienen algún acuerdo sobre el celular en casa? Pueden escribir con su nombre o con un seudónimo; yo leo y respondo cada comentario.\n\nY si al leer esto se reconocieron y sienten que la distancia ya les está pesando, quiero invitarlos a trabajarlo en serio: en mi terapia de pareja online los acompaño a reconstruir la conexión, a acordar reglas digitales justas para los dos y a volver a elegirse todos los días. Son sesiones de 60 minutos por videollamada, desde donde estén. Escríbanme por WhatsApp con el botón de esta página y conversemos. — Dayla" },
  { id: "local-5", titulo: "Cuando la plata no alcanza, el amor se tensa", intro: "Las peleas por dinero rara vez son por el dinero. El Modelo de Estrés Familiar de Conger explica la cadena completa: presión económica, malestar, conflicto y una relación que se enfría. Y hay un tema del que casi nadie habla: la infidelidad financiera. — Dayla", contenido: "Termina de pasar: una discusión por un gasto «pequeño» —un mercado, una salida, una compra por internet— que en minutos ya no es por ese gasto, sino por todo lo acumulado. Si las peleas de plata en su casa se sienten más grandes que la plata misma, hay una explicación, y no es que sean «malos para el dinero».\n\nEl psicólogo Rand Conger y su equipo describieron en 1994 el Modelo de Estrés Familiar, y sigue siendo la referencia para entenderlo: no daña la relación el monto de la deuda ni el tamaño del gasto; daña la cadena que se activa. Primero llega la dificultad económica; luego la presión que cada uno siente por dentro; esa presión produce malestar, cansancio e irritabilidad; el malestar se convierte en conflicto; y el conflicto repetido va bajando la satisfacción y la estabilidad de la pareja. Por eso dos parejas con exactamente la misma deuda la viven tan distinto: lo que cambia es cómo la enfrentan juntos.\n\nLa evidencia reciente lo confirma. Un metaanálisis de Falconier y Jackson (2020) encontró que el estrés financiero se asocia con más conflicto y menos satisfacción en las parejas. Y un estudio de Jackson y colaboradores (2023) afinó el punto: cuando la pareja no entra en conflicto por el dinero, la tensión económica por sí sola casi no predice insatisfacción. Traducción: el problema no es la plata; es la pelea por la plata.\n\nHay además un tema del que casi nadie habla en voz alta: la infidelidad financiera. Es esconder deudas, compras, cuentas o préstamos —a la familia, a un amigo— que la pareja no conoce. No se mide en pesos: se mide en confianza rota, y por eso duele parecido a otras traiciones. En un estudio con 1.654 parejas (LeBaron-Black y colaboradores, 2024), el conflicto por dinero, el engaño financiero y que uno solo decida erosionan justo eso que sostiene a la pareja: la sensación de estar en el mismo equipo.\n\nJohn Gottman dice que detrás de cada posición sobre el dinero hay una historia y un sueño: quien creció en escasez quizá ahorra desde el miedo; quien creció con abundancia quizá gasta desde la confianza. Cuando solo se pelea por el gasto, sin hablar del miedo o del sueño que hay debajo, la pareja pelea a ciegas. Y el terapeuta Guy Bodenmann propone la salida: el afrontamiento en equipo —pasar del «es tu culpa» al «este es un estrés nuestro»— protege la relación incluso cuando la plata no alcanza.\n\nSeñales para reconocerse: evitan hablar de dinero hasta que algo estalla; las discusiones por gastos menores escalan rapidísimo; uno de los dos decide y el otro se entera después; hay compras o deudas escondidas «para no preocupar»; uno solo carga con todo el control y el otro se siente como un niño regañado. Si se vieron en alguna, no es un fracaso: es el punto de partida.\n\nEn terapia esto se trabaja paso a paso: ponerle nombre al enemigo común (el estrés, no la pareja), conocer la historia que cada uno trae con el dinero, armar un sistema financiero que los dos perciban como justo —fondo común, aportes proporcionales al ingreso y un monto personal libre para cada uno, sin rendir cuentas— y tener una reunión breve y tranquila de dinero cada cierto tiempo, en vez de discutirlo en caliente. Y cuando hay engaño financiero, primero se repara la confianza.\n\nCuéntenme en los comentarios: ¿cómo manejan la plata en su casa: todo junto, todo separado, mitad y mitad? ¿Han logrado hablar de dinero sin pelear alguna vez? Pueden participar con un seudónimo; yo misma les respondo.\n\nY mi invitación de siempre: si la plata se volvió el tercer integrante de su relación, no tienen que resolverlo solos. En mi terapia de pareja online trabajamos exactamente esto: bajar el conflicto, hablar de dinero sin guerra y volver a sentirse equipo. Son sesiones de 60 minutos por videollamada, 100% online. Escríbanme por WhatsApp y agendemos la primera sesión. — Dayla" }
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
  function pintarApertura(t) {
    const texto = (t.contenido && t.contenido.trim()) ? t.contenido : t.intro;
    if (!texto) return null;
    const art = el('article', 'foro-apertura');
    art.appendChild(el('p', 'foro-meta', 'Tema abierto por Dayla Sánchez · Psicóloga'));
    texto.split(/\n\n+/).forEach((par) => {
      const limpio = par.trim();
      if (limpio) art.appendChild(el('p', 'foro-apertura-p', limpio));
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
