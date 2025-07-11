document.addEventListener('DOMContentLoaded', () => {
  const itemsContainer = document.getElementById('carrito-items');
  const totalElement = document.getElementById('carrito-total');
  const mensajeSesion = document.getElementById('mensaje-sesion');
  const resumen = document.querySelector('.resumen-externo');
  const carritoContainer = document.querySelector('.carrito-container');
  const btnProceder = document.querySelector('.btn-comprar');

  function verificarSesion() {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const logueado = usuario && usuario.rol === 'cliente';

    if (!logueado) {
      mensajeSesion.style.display = 'block';
      resumen.style.display = 'none';
      carritoContainer.style.display = 'none';
    } else {
      mensajeSesion.style.display = 'none';
      resumen.style.display = 'block';
      carritoContainer.style.display = 'block';
    }

    return logueado;
  }

  function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const contador = document.getElementById('cart-count');
    if (contador) contador.textContent = total;
  }

  function renderCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    itemsContainer.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
      itemsContainer.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
      totalElement.textContent = 'S/ 0.00';
      actualizarContadorCarrito();
      return;
    }

    carrito.forEach((item, index) => {
      itemsContainer.innerHTML += `
        <div class="item">
          <img src="${item.imagen}" alt="${item.nombre}">
          <div class="info">
            <h3>${item.nombre}</h3>
            <div class="cantidad-controles">
              <button class="btn-restar" data-index="${index}">-</button>
              <span>${item.cantidad}</span>
              <button class="btn-sumar" data-index="${index}">+</button>
            </div>
            <p>Precio: S/ ${item.precio.toFixed(2)}</p>
            <p>Subtotal: S/ ${(item.precio * item.cantidad).toFixed(2)}</p>
            <button class="btn-eliminar" data-index="${index}">🗑 Eliminar</button>
          </div>
        </div>`;
      total += item.precio * item.cantidad;
    });

    totalElement.textContent = `S/ ${total.toFixed(2)}`;
    actualizarContadorCarrito();

    // Event listeners para botones
    document.querySelectorAll('.btn-sumar').forEach(btn => {
      btn.addEventListener('click', () => {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito[btn.dataset.index].cantidad++;
        guardarCarrito(carrito);
        renderCarrito();
      });
    });

    document.querySelectorAll('.btn-restar').forEach(btn => {
      btn.addEventListener('click', () => {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const index = btn.dataset.index;
        if (carrito[index].cantidad > 1) {
          carrito[index].cantidad--;
        } else {
          carrito.splice(index, 1);
        }
        guardarCarrito(carrito);
        renderCarrito();
      });
    });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', () => {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carrito.splice(btn.dataset.index, 1);
        guardarCarrito(carrito);
        renderCarrito();
      });
    });
  }

  btnProceder.addEventListener('click', () => {
    if (verificarSesion()) {
      window.location.href = '../ProcederPago/ProcederPago.html';
    } else {
      mensajeSesion.scrollIntoView({ behavior: 'smooth' });
    }
  });

  verificarSesion();
  renderCarrito();
});
