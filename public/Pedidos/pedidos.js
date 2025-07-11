document.addEventListener('DOMContentLoaded', async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const tablaBody = document.getElementById('tabla-pedidos-body');

  if (!usuario || usuario.rol !== 'cliente') {
    tablaBody.innerHTML = `
      <tr>
        <td colspan="5" style="color:red; text-align:center; font-weight:bold;">
          ⚠️ Debes iniciar sesión como cliente para ver tus pedidos.
        </td>
      </tr>`;
    return;
  }

  try {
    const res = await fetch('/pedidos/cliente/' + usuario.id); // id = cliente_id
    const pedidos = await res.json();

    if (!Array.isArray(pedidos) || pedidos.length === 0) {
      tablaBody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center;">No tienes pedidos registrados.</td>
        </tr>`;
      return;
    }

    // Renderizar pedidos
    pedidos.forEach(pedido => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${pedido.id}</td>
        <td>${new Date(pedido.fecha).toLocaleDateString()}</td>
        <td>${pedido.estado}</td>
        <td>S/ ${pedido.total.toFixed(2)}</td>
        <td><button onclick="verDetalles(${pedido.id})">Ver</button></td>
      `;
      tablaBody.appendChild(fila);
    });

  } catch (err) {
    console.error('❌ Error al cargar pedidos:', err);
    tablaBody.innerHTML = `
      <tr>
        <td colspan="5" style="color:red; text-align:center;">
          Error al cargar pedidos. Intenta más tarde.
        </td>
      </tr>`;
  }
});

// Mostrar alerta con detalles del pedido (puedes cambiar a modal más adelante)
async function verDetalles(pedidoId) {
  try {
    const res = await fetch(`/detalle-pedidos/pedido/${pedidoId}`);
    const detalles = await res.json();

    if (!Array.isArray(detalles) || detalles.length === 0) {
      alert('No hay productos en este pedido.');
      return;
    }

    let mensaje = '🧾 Detalles del pedido:\n\n';
    detalles.forEach(item => {
      mensaje += `- ${item.nombre_producto} x ${item.cantidad} → S/ ${item.precio_unitario}\n`;
    });

    alert(mensaje);
  } catch (err) {
    alert('❌ Error al obtener detalles del pedido.');
    console.error(err);
  }
}
