document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('.sidebar a[data-section]');
  const sections = document.querySelectorAll('.dashboard-section');

  // Cambiar visibilidad de secciones
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('data-section');

      sections.forEach(section => section.classList.remove('active'));
      document.getElementById(targetId).classList.add('active');

      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
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
        });
      }
    })
    .catch(error => console.error('❌ Error al cargar productos:', error));

  // 🔄 Cargar pedidos con nombre del cliente y producto
  fetch('/pedidos')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('pedidos-body');
      tbody.innerHTML = '';
      data.forEach((pedido, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${pedido.nombre_cliente}</td>
          <td>${pedido.nombre_producto}</td>
          <td>${pedido.estado}</td>
          <td>
            <button class="edit">Editar</button>
            <button class="delete">Eliminar</button>
          </td>
        `;
        tbody.appendChild(fila);
      });
    })
    .catch(err => console.error('❌ Error al cargar pedidos:', err));

  // 🔄 Cargar clientes con nombre, correo y teléfono
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
      });
    })
    .catch(err => console.error('❌ Error al cargar clientes:', err));
});
