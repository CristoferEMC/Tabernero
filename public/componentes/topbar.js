document.addEventListener('DOMContentLoaded', () => {
  fetch('/componentes/topbar.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('topbar-container').innerHTML = html;

      const usuarioData = JSON.parse(localStorage.getItem('usuario'));
      const enlaceUsuario = document.getElementById('usuario-enlace');
      const nombreUsuario = document.getElementById('nombre-usuario');
      const iconoUsuario = document.getElementById('icono-usuario');
      const dropdown = document.getElementById('usuario-dropdown');

      if (usuarioData && usuarioData.nombre && usuarioData.rol) {
        const primerNombre = usuarioData.nombre.split(' ')[0];
        nombreUsuario.textContent = primerNombre;
        iconoUsuario.style.display = 'inline';
        enlaceUsuario.href = '#';

        enlaceUsuario.addEventListener('click', (e) => {
          e.preventDefault();
          dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        let htmlDropdown = `<a href="../Pedidos/pedidos.html">📦 Pedidos</a>`;
        if (usuarioData.rol === 'trabajador') {
          htmlDropdown += `<a href="/dashboard/dashboard.html">⚙️ Panel</a>`;
        }
        htmlDropdown += `<a href="#" id="cerrar-sesion">🚪 Cerrar sesión</a>`;
        dropdown.innerHTML = htmlDropdown;

        // 👉 Re-agregar el evento después de inyectar el HTML
        setTimeout(() => {
          const cerrarSesionBtn = document.getElementById('cerrar-sesion');
          if (cerrarSesionBtn) {
            cerrarSesionBtn.addEventListener('click', (e) => {
              e.preventDefault();
              localStorage.removeItem('usuario');
              localStorage.removeItem('seccionActiva'); // 👈 muy importante
              window.location.href = '/index.html';
            });
          }
        }, 50);

        document.addEventListener('click', (event) => {
          if (!document.getElementById('usuario-nav').contains(event.target)) {
            dropdown.style.display = 'none';
          }
        });

      } else {
        enlaceUsuario.href = '../Login/login.html';
        nombreUsuario.textContent = 'INGRESAR';
        iconoUsuario.style.display = 'none';
      }

      const actualizarContadorCarrito = () => {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        const contador = document.getElementById('cart-count');
        if (contador) contador.textContent = total;
      };

      actualizarContadorCarrito();
    })
    .catch(err => console.error('❌ Error al cargar topbar:', err));
});
