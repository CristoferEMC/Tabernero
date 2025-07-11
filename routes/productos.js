const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../dbConfig');
const multer = require('multer');
const path = require('path');
const { subirImagenAzure } = require('../utils/azureStorage');


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

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  // Validar que ID sea numérico
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido. Debe ser un número.' });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.Int, parseInt(id)) // asegurar entero
      .query('SELECT * FROM productos WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error al obtener producto por ID:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
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



const upload = multer(); // usar memoria

router.post('/', upload.single('imagen'), async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  const imagen = req.file;

  try {
    // Subir imagen y obtener URL
    const urlImagen = await subirImagenAzure(imagen);

    // Guardar en base de datos
    await sql.query`
      INSERT INTO productos (nombre, descripcion, precio, imagen_url)
      VALUES (${nombre}, ${descripcion}, ${precio}, ${urlImagen})
    `;
    res.status(201).send({ message: 'Producto creado con imagen' });
  } catch (error) {
    console.error('❌ Error al crear producto con imagen:', error);
    res.status(500).send({ error: 'Error interno' });
  }
});


module.exports = router;
