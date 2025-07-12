const params = new URLSearchParams(window.location.search);
const tipo = params.get('tipo');
const id = parseInt(params.get('id'));

if (!tipo || isNaN(id)) {
  alert('❌ Falta el tipo o el ID es inválido en la URL');
  window.location.href = '../dashboard.html';
}


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById('entidad-id').value = id;

  const titulo = document.getElementById('titulo-formulario');
  const form = document.getElementById('form-editar');

  // Mostrar campos según el tipo
  if (tipo === 'producto') {
    titulo.textContent = 'Editar Producto';
    document.getElementById('campos-producto').style.display = 'block';

    fetch(`/productos/${id}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById('nombre').value = data.nombre;
        document.getElementById('descripcion').value = data.descripcion;
        document.getElementById('precio').value = data.precio;
      });

  } else if (tipo === 'cliente') {
    titulo.textContent = 'Editar Cliente';
    document.getElementById('campos-cliente').style.display = 'block';

    fetch(`/clientes/${id}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById('nombre-cliente').value = data.nombre;
        document.getElementById('correo-cliente').value = data.correo;
        document.getElementById('telefono-cliente').value = data.telefono;
        document.getElementById('direccion-cliente').value = data.direccion;
      });

  } else if (tipo === 'pedido') {
    titulo.textContent = 'Editar Pedido';
    document.getElementById('campos-pedido').style.display = 'block';

    fetch(`/pedidos/${id}`)
      .then(res => res.json())
      .then(pedido => {
        document.getElementById('estado-pedido').value = pedido.estado;
        document.getElementById('nombre-cliente-pedido').value = pedido.nombre_cliente;

      });
  }

  // Enviar actualización
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let body = {};
    let url = `/${tipo}s/${id}`; // Ej: /productos/1, /clientes/2, /pedidos/3

    if (tipo === 'producto') {
      body = {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precio: document.getElementById('precio').value
      };
    } else if (tipo === 'cliente') {
      body = {
        nombre: document.getElementById('nombre-cliente').value,
        correo: document.getElementById('correo-cliente').value,
        telefono: document.getElementById('telefono-cliente').value,
        direccion: document.getElementById('direccion-cliente').value
      };
    } else if (tipo === 'pedido') {
      body = {
        estado: document.getElementById('estado-pedido').value
      };
    } else if (tipo === 'usuario') {
      body = {
        nombre: document.getElementById('nombre-usuario').value,
        correo: document.getElementById('correo-usuario').value,
        contrasena: document.getElementById('contrasena-usuario').value
      };
    }

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        alert(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} actualizado correctamente`);
        window.location.href = '../dashboard.html';
      } else {
        alert(`Error al actualizar ${tipo}`);
      }
    } catch (err) {
      alert('Error de conexión con el servidor');
      console.error(err);
    }
  });

});
