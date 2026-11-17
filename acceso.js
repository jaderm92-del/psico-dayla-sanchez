// Página privada de acceso de Dayla (/acceso, sin enlaces desde el sitio).
// Al ingresar, guarda la sesión y lleva directo al foro con sus herramientas.
(function initAcceso() {
  const form = document.getElementById('acceso-form');
  if (!form) return;
  const aviso = document.getElementById('acceso-aviso');
  if (sessionStorage.getItem('foro_admin_token')) {
    aviso.textContent = 'Ya tienes la sesión activa. Llevándote al foro…';
    location.href = 'foro';
    return;
  }
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const email = document.getElementById('acceso-email').value.trim();
    const pass = document.getElementById('acceso-pass').value;
    aviso.textContent = 'Ingresando…';
    try {
      const r = await fetch(FORO_URL + '/auth/v1/token?grant_type=password', {
        method: 'POST',
        headers: { 'apikey': FORO_ANON, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: pass })
      });
      const data = await r.json();
      if (!r.ok || !data.access_token) throw new Error('login');
      sessionStorage.setItem('foro_admin_token', data.access_token);
      aviso.textContent = 'Bienvenida, Dayla. Llevándote al foro…';
      location.href = 'foro';
    } catch (e) {
      aviso.textContent = 'No se pudo ingresar. Revisa el correo y la contraseña.';
    }
  });
})();
