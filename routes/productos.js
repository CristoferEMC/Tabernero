const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../dbConfig');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM productos');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener productos:', err.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' }); // Validación segura

    const pool = await sql.connect(dbConfig);
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM productos WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error al obtener producto por ID:', err.message);
    res.status(500).json({ error: 'Error al obtener producto por ID' });
  }
});

// ✅ Actualizar un producto (PUT)
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).send("ID inválido");

    const { nombre, descripcion, precio } = req.body;

    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.NVarChar, nombre)
      .input('descripcion', sql.NVarChar, descripcion)
      .input('precio', sql.Decimal(10, 2), precio)
      .query(`
        UPDATE productos
        SET nombre = @nombre,
            descripcion = @descripcion,
            precio = @precio
        WHERE id = @id
      `);

    res.sendStatus(200);
  } catch (err) {
    console.error('Error al actualizar producto:', err.message);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

module.exports = router;
