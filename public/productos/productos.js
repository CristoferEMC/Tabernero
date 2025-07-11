document.addEventListener('DOMContentLoaded', async () => {
  const contenedor = document.querySelector('.productos-container');

  try {
    const res = await fetch('/productos');
    const productos = await res.json();

    contenedor.innerHTML = ''; // Limpiar por si acaso

    productos.forEach(producto => {
      const div = document.createElement('div');
      div.classList.add('producto');

      div.innerHTML = `
        <h2>${producto.nombre}</h2>
        <p>${producto.descripcion}</p>
        <p><strong>S/. ${producto.precio.toFixed(2)}</strong></p>
      `;

      contenedor.appendChild(div);
    });
  } catch (err) {
    console.error('❌ Error al cargar productos:', err);
    contenedor.innerHTML = '<p>Error al cargar productos.</p>';
  }
});
