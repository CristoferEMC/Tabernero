const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Obtener lista de clientes con nombre, correo, teléfono y dirección
router.get('/', async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT 
        u.nombre, 
        u.correo, 
        c.telefono,
        c.direccion
      FROM clientes c
      INNER JOIN usuarios u ON c.usuario_id = u.id
    `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('❌ Error al obtener clientes:', err.message);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

module.exports = router;
