// Obtener el ID desde la URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (id) {
  // Obtener los datos del producto desde el servidor
  fetch(`/productos/${id}`)
    .then(res => res.json())
    .then(producto => {
      document.getElementById('producto-id').value = producto.id;
      document.getElementById('nombre').value = producto.nombre;
      document.getElementById('descripcion').value = producto.descripcion;
      document.getElementById('precio').value = producto.precio;
    })
    .catch(err => {
      alert('Error al obtener el producto');
      console.error(err);
    });
} else {
  alert('ID de producto no especificado');
}

// Enviar PUT al servidor
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('form-editar').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('producto-id').value;
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = document.getElementById('precio').value;

    const res = await fetch(`/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, descripcion, precio })
    });

    if (res.ok) {
      alert('Producto actualizado correctamente');
      window.location.href = '../dashboard.html';
    } else {
      alert('Error al actualizar producto');
    }
  });
});
