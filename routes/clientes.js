const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../dbConfig');

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT 
        c.id,
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

// Obtener cliente por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT 
          c.id,
          u.nombre,
          u.correo,
          c.telefono,
          c.direccion
        FROM clientes c
        INNER JOIN usuarios u ON c.usuario_id = u.id
        WHERE c.id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Error al obtener cliente por ID:', err.message);
    res.status(500).json({ error: 'Error al obtener cliente por ID' });
  }
});

// Actualizar cliente
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, telefono, direccion } = req.body;

    const pool = await sql.connect(dbConfig);

    // Obtener el ID de usuario relacionado al cliente
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT usuario_id FROM clientes WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    const usuario_id = result.recordset[0].usuario_id;

    // Actualizar tabla usuarios
    await pool.request()
      .input('usuario_id', sql.Int, usuario_id)
      .input('nombre', sql.NVarChar, nombre)
      .input('correo', sql.NVarChar, correo)
      .query(`
        UPDATE usuarios
        SET nombre = @nombre,
            correo = @correo
        WHERE id = @usuario_id
      `);

    // Actualizar tabla clientes
    await pool.request()
      .input('id', sql.Int, id)
      .input('telefono', sql.NVarChar, telefono)
      .input('direccion', sql.NVarChar, direccion)
      .query(`
        UPDATE clientes
        SET telefono = @telefono,
            direccion = @direccion
        WHERE id = @id
      `);

    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Error al actualizar cliente:', err.message);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

module.exports = router;
