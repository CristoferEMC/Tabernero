const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.post('/', async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  if (!nombre || !correo || !contraseña) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  try {
    // Verificar si el correo ya existe
    const verificarCorreo = await sql.query`
      SELECT id FROM usuarios WHERE correo = ${correo}
    `;

    if (verificarCorreo.recordset.length > 0) {
      return res.status(409).json({ error: '⚠️ El correo ya está registrado. Intenta con otro.' });
    }

    // Insertar nuevo usuario
    await sql.query`
      INSERT INTO usuarios (nombre, correo, contraseña, rol)
      VALUES (${nombre}, ${correo}, ${contraseña}, 'cliente')
    `;

    res.json({ message: '✅ Registro exitoso. Redirigiendo al login...' });
  } catch (err) {
    console.error('❌ Error al registrar usuario:', err.message);
    res.status(500).json({ error: 'Error interno al registrar el usuario.' });
  }
});

module.exports = router;
