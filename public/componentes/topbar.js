document.addEventListener('DOMContentLoaded', () => {
  fetch('/componentes/topbar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('topbar-container').innerHTML = html;

      const usuario = localStorage.getItem('usuarioNombre');
      const enlaceUsuario = document.getElementById('usuario-enlace');
      const nombreUsuario = document.getElementById('nombre-usuario');
      const iconoUsuario = document.getElementById('icono-usuario');
      const dropdown = document.getElementById('usuario-dropdown');
      const cerrarSesionBtn = document.getElementById('cerrar-sesion');

      if (usuario) {
        const primerNombre = usuario.split(' ')[0];
        nombreUsuario.textContent = primerNombre;
        iconoUsuario.style.display = 'inline';
        enlaceUsuario.href = '#';

        // Mostrar menú al hacer click
        enlaceUsuario.addEventListener('click', (e) => {
          e.preventDefault();
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Botón cerrar sesión
        if (cerrarSesionBtn) {
          cerrarSesionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('usuarioNombre');
            window.location.href = '/index.html';
          });
        }

        // Ocultar el dropdown si hace clic fuera
        document.addEventListener('click', (event) => {
          if (!document.getElementById('usuario-nav').contains(event.target)) {
            dropdown.style.display = 'none';
          }
        });
      } else {
        // Si no está logueado, mantener enlace a login
        enlaceUsuario.href = '../Login/login.html';
      }
    })
    .catch(err => console.error('❌ Error al cargar topbar:', err));
});
