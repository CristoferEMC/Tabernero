document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-crear');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nombre', document.getElementById('nombre').value);
    formData.append('descripcion', document.getElementById('descripcion').value);
    formData.append('precio', document.getElementById('precio').value);
    formData.append('imagen', document.getElementById('imagen').files[0]);

    try {
      const res = await fetch('/productos', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        alert('✅ Producto creado con imagen');
        window.location.href = '../dashboard.html';
      } else {
        alert('❌ Error al crear producto');
      }
    } catch (err) {
      console.error('❌ Error de conexión:', err);
      alert('Error al conectar con el servidor');
    }
  });
});
