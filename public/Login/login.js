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


        if (res.ok) {
            // Guardar el nombre del usuario en localStorage
            localStorage.setItem('usuarioNombre', data.nombre); // "Eduar Medina"

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
        mensaje.textContent = 'Error al iniciar sesión';
        mensaje.style.color = 'red';
        console.error('❌ Error:', err);
    }
});
