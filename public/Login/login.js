document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const correo = document.getElementById('correo').value.trim();
  const contraseña = document.getElementById('contraseña').value.trim();
  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = '';

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contraseña })
    });

    const data = await res.json();
    console.log('🔐 Login recibido del backend:', data);

    if (res.ok) {
      const usuario = {
        nombre: data.nombre,
        rol: data.rol,
        correo: data.correo
      };

      if (data.rol === 'cliente') {
        if (!data.cliente_id) {
          mensaje.textContent = '⚠️ No se encontró cliente_id para este usuario.';
          mensaje.style.color = 'red';
          return;
        }
        usuario.id = data.cliente_id;
      } else {
        usuario.id = data.usuario_id;
      }

      localStorage.setItem('usuario', JSON.stringify(usuario));

      if (data.rol === 'trabajador') {
        window.location.href = '../Dashboard/dashboard.html';
      } else if (data.rol === 'cliente') {
        window.location.href = '../index.html';
      } else {
        mensaje.textContent = '⚠️ Rol no reconocido.';
        mensaje.style.color = 'red';
      }

    } else {
      mensaje.textContent = data.error || 'Credenciales inválidas';
      mensaje.style.color = 'red';
    }

  } catch (err) {
    mensaje.textContent = '❌ Error al iniciar sesión';
    mensaje.style.color = 'red';
    console.error('❌ Error en login:', err);
  }
});
