document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('.sidebar a[data-section]');
  const sections = document.querySelectorAll('.dashboard-section');

  // Restaurar sección activa desde localStorage (si existe)
  const ultimaSeccion = localStorage.getItem('seccionActiva');
  if (ultimaSeccion) {
    sections.forEach(section => section.classList.remove('active'));
    links.forEach(link => link.classList.remove('active'));

    const targetSection = document.getElementById(ultimaSeccion);
    const targetLink = document.querySelector(`.sidebar a[data-section="${ultimaSeccion}"]`);

    if (targetSection) targetSection.classList.add('active');
    if (targetLink) targetLink.classList.add('active');
  }
  // 🔐 Funcionalidad para el botón "Salir"
  const btnSalir = document.getElementById('btn-salir');
  if (btnSalir) {
    btnSalir.addEventListener('click', (e) => {
      e.preventDefault();

      setTimeout(() => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('seccionActiva'); // 👈 limpia sección recordada
        window.location.href = '/index.html';
      }, 50); // da tiempo a que se liberen recursos o cierre visualmente el panel
    });
  }

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (usuario && usuario.nombre) {
    document.getElementById('nombre-usuario-bienvenida').textContent = usuario.nombre;
  }
  


  // Navegación entre secciones
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('data-section');

      sections.forEach(section => section.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');

      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      localStorage.setItem('seccionActiva', targetId);
    });
  });

  // 🔄 Cargar productos
  fetch('/productos')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('productos-body');
      if (tbody) {
        tbody.innerHTML = '';
        data.forEach((producto, index) => {
          const fila = document.createElement('tr');
          fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion || 'Sin descripción'}</td>
            <td>S/ ${parseFloat(producto.precio).toFixed(2)}</td>
            <td>
              <button class="edit">Editar</button>
              <button class="delete">Eliminar</button>
            </td>
          `;
          tbody.appendChild(fila);

          // Redirigir al editar/eliminar con ID
          const editarBtn = fila.querySelector('.edit');
          const eliminarBtn = fila.querySelector('.delete');

          editarBtn.addEventListener('click', () => {
            window.location.href = `Editar/Editar.html?tipo=producto&id=${producto.id}`;
          });


          eliminarBtn.addEventListener('click', () => {
            window.location.href = `Eliminar/Eliminar.html?id=${producto.id}`;
          });
        });
      }
    })
    .catch(error => console.error('❌ Error al cargar productos:', error));

  // 🔄 Cargar pedidos
  fetch('/pedidos')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('pedidos-body');
      tbody.innerHTML = '';
      data.forEach((pedido, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${pedido.nombre_cliente}</td>
          <td>${pedido.productos}</td>
          <td>${pedido.estado}</td>
          <td>
            <button class="edit">Editar</button>
            <button class="delete">Eliminar</button>
          </td>
        `;
        tbody.appendChild(fila);

        // Redirigir con ID de pedido
        const editarBtn = fila.querySelector('.edit');
        const eliminarBtn = fila.querySelector('.delete');

        editarBtn.addEventListener('click', () => {
          window.location.href = `Editar/Editar.html?tipo=pedido&id=${pedido.id}`;
        });



        eliminarBtn.addEventListener('click', () => {
          window.location.href = `Eliminar/Eliminar.html?id=${pedido.id}`;
        });
      });
    })
    .catch(err => console.error('❌ Error al cargar pedidos:', err));

  // 🔄 Cargar clientes
  fetch('/clientes')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('clientes-body');
      tbody.innerHTML = '';
      data.forEach(cliente => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${cliente.nombre}</td>
          <td>${cliente.correo}</td>
          <td>${cliente.telefono}</td>
          <td>
            <button class="edit">Editar</button>
            <button class="delete">Eliminar</button>
          </td>
        `;
        tbody.appendChild(fila);

        // Redirigir con ID de cliente
        const editarBtn = fila.querySelector('.edit');
        const eliminarBtn = fila.querySelector('.delete');

        editarBtn.addEventListener('click', () => {
          window.location.href = `Editar/Editar.html?tipo=cliente&id=${cliente.id}`;
        });


        eliminarBtn.addEventListener('click', () => {
          window.location.href = `Eliminar/Eliminar.html?id=${cliente.id}`;
        });
      });
    })
    .catch(err => console.error('❌ Error al cargar clientes:', err));

  // Activar sección por defecto (Inicio) si no hay una previa guardada
  if (!ultimaSeccion) {
    const defaultSection = document.querySelector('.sidebar a[data-section]');
    if (defaultSection) {
      defaultSection.classList.add('active');
      const sectionId = defaultSection.getAttribute('data-section');
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) sectionElement.classList.add('active');
    }
  }
  // 👉 Agregar funcionalidad al botón "Crear Producto"
  const btnCrear = document.getElementById('btn-crear-producto');
  if (btnCrear) {
    btnCrear.addEventListener('click', () => {
      window.location.href = 'Crear/Crear.html';
    });
  }

});
