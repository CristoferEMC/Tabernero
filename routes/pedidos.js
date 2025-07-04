const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Obtener pedidos con nombre del cliente, producto, fecha y estado
router.get('/', async (req, res) => {
  try {
    const result = await sql.query(`
      SELECT 
        u.nombre AS nombre_cliente,
        p.nombre AS nombre_producto,
        pe.fecha,
        pe.estado
      FROM pedidos pe
      INNER JOIN clientes c ON pe.cliente_id = c.id
      INNER JOIN usuarios u ON c.usuario_id = u.id
      INNER JOIN detalle_pedidos dp ON dp.pedido_id = pe.id
      INNER JOIN productos p ON dp.producto_id = p.id
    `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('❌ Error al obtener pedidos:', err.message);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

module.exports = router;
