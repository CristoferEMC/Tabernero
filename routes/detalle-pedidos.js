const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../dbConfig');

router.get('/', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query('SELECT * FROM detalle_pedidos');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Obtener detalle de un pedido específico
router.get('/pedido/:pedido_id', async (req, res) => {
  const { pedido_id } = req.params;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('pedido_id', sql.Int, pedido_id)
      .query(`
        SELECT dp.*, p.nombre AS nombre_producto
        FROM detalle_pedidos dp
        INNER JOIN productos p ON dp.producto_id = p.id
        WHERE dp.pedido_id = @pedido_id
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al obtener detalles del pedido:', err.message);
    res.status(500).json({ error: 'Error al obtener detalles del pedido' });
  }
});

module.exports = router;
