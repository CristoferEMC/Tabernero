document.getElementById('registro-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const contraseña = document.getElementById('contraseña').value.trim();

  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = ''; // Limpiar antes
  mensaje.classList.remove('mensaje-exito', 'mensaje-error'); // Remover clases previas

  const res = await fetch('/registro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, correo, contraseña })
  });

  const data = await res.json();
  mensaje.textContent = data.message || data.error;

  if (res.ok) {
    mensaje.classList.add('mensaje-exito');
    setTimeout(() => {
      window.location.href = '../Login/login.html';
    }, 2000);
  } else {
    mensaje.classList.add('mensaje-error');
  }
});
