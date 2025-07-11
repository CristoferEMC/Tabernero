document.addEventListener('DOMContentLoaded', () => {
  const resumenContainer = document.getElementById('resumen-pedido');
  const formularioPago = document.querySelector('.formulario-pago');
  const formTarjeta = document.getElementById('form-tarjeta');
  const formYape = document.getElementById('form-yape');
  const direccionInput = document.getElementById('direccion');

  // Verificar si el usuario está logueado
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const cliente_id = usuario?.id; // ✅ Debe ser el cliente_id que se obtuvo en login

  if (!usuario) {
    resumenContainer.innerHTML = `
      <p style="color: red; text-align: center; font-weight: bold;">
        ⚠️ Debes <a href="../Login/login.html" style="color: #a52a2a;">iniciar sesión</a> para completar tu compra.
      </p>`;
    formularioPago.style.display = 'none';
    return;
  }

  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  if (carrito.length === 0) {
    resumenContainer.innerHTML = `
      <p style="text-align: center;">
        Tu carrito está vacío. <a href="../productos/productos.html">Ir a productos</a>
      </p>`;
    formularioPago.style.display = 'none';
    return;
  }

  // Renderizar resumen de pedido
  let total = 0;
  const resumenHTML = `
    <h3>Resumen de tu pedido:</h3>
    <ul>
      ${carrito.map(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    return `<li>${item.nombre} x ${item.cantidad} <span>S/ ${subtotal.toFixed(2)}</span></li>`;
  }).join('')}
    </ul>
    <p style="text-align:right; font-weight:bold;">Total: <span style="color:#a52a2a;">S/ ${total.toFixed(2)}</span></p>
  `;
  resumenContainer.innerHTML = resumenHTML;

  // Evento para cambiar método de pago
  document.querySelectorAll('input[name="pago"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'tarjeta') {
        formTarjeta.style.display = 'block';
        formYape.style.display = 'none';
      } else {
        formTarjeta.style.display = 'none';
        formYape.style.display = 'block';
      }
    });
  });

  // Evento para cambiar tipo de entrega
  document.querySelectorAll('input[name="entrega"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'delivery') {
        direccionInput.style.display = 'block';
        direccionInput.required = true;
      } else {
        direccionInput.style.display = 'none';
        direccionInput.required = false;
      }
    });
  });

  formularioPago.addEventListener('submit', async (e) => {
    e.preventDefault();

    const cliente_id = usuario.id;
    const nombre = document.getElementById('nombre').value;
    const tipo_entrega = document.querySelector('input[name="entrega"]:checked').value;
    const metodo_pago = document.querySelector('input[name="pago"]:checked').value;
    const direccion = (tipo_entrega === 'delivery') ? document.getElementById('direccion').value : '';
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    let total = 0;
    const productos = carrito.map(item => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;
      return {
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio
      };
    });

    const pedido = {
      cliente_id,
      nombre,
      tipo_entrega,
      metodo_pago,
      direccion,
      total,
      productos
    };

    try {
      const res = await fetch('/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });

      if (res.ok) {
        alert('✅ ¡Gracias por tu compra! Tu pedido ha sido registrado.');
        localStorage.removeItem('carrito');
        window.location.href = '../index.html';
      } else {
        const error = await res.json();
        alert('❌ Error al registrar pedido: ' + error.error);
      }

    } catch (err) {
      alert('❌ Error de red al registrar pedido.');
      console.error(err);
    }
  });

});
