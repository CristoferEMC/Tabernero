document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.querySelector('.productos-container');
  const buscador = document.getElementById('buscador');

  let productosGlobal = [];
  function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    const contador = document.getElementById('cart-count');
    if (contador) {
      contador.textContent = total;
    }
  }


  try {
    const res = await fetch('/productos');
    const productos = await res.json();
    productosGlobal = productos;

    renderizarProductos(productos);
  } catch (err) {
    console.error('❌ Error al cargar productos:', err);
    contenedor.innerHTML = '<p>Error al cargar productos.</p>';
  }

  function renderizarProductos(productos) {
    contenedor.innerHTML = '';

    productos.forEach(producto => {
      const div = document.createElement('div');
      div.classList.add('producto');

      div.innerHTML = `
        <img src="${producto.imagen_url}" alt="${producto.nombre}">
        <h2>${producto.nombre}</h2>
        <p><strong>S/. ${producto.precio.toFixed(2)}</strong></p>
        <button class="btn-agregar"><i class="fas fa-plus"></i></button>
      `;

      const btnAgregar = div.querySelector('.btn-agregar');

      btnAgregar.addEventListener('click', () => {
        agregarAlCarrito(producto);
      });

      contenedor.appendChild(div);
    });
  }

  function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const index = carrito.findIndex(item => item.id === producto.id);
    if (index !== -1) {
      carrito[index].cantidad += 1;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen_url,
        cantidad: 1
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert(`${producto.nombre} fue agregado al carrito.`);

    // ✅ Actualiza el contador en el topbar:
    actualizarContadorCarrito();
  }


  buscador.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = productosGlobal.filter(p =>
      p.nombre.toLowerCase().includes(texto)
    );
    renderizarProductos(filtrados);
  });
});
