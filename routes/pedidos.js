const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../dbConfig');

// ✅ Obtener pedidos con todos los productos asociados (agrupados)
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT 
        pe.id,
        u.nombre AS nombre_cliente,
        STRING_AGG(p.nombre, ', ') AS productos,
        pe.fecha,
        pe.estado
      FROM pedidos pe
      INNER JOIN clientes c ON pe.cliente_id = c.id
      INNER JOIN usuarios u ON c.usuario_id = u.id
      INNER JOIN detalle_pedidos dp ON dp.pedido_id = pe.id
      INNER JOIN productos p ON dp.producto_id = p.id
      GROUP BY pe.id, u.nombre, pe.fecha, pe.estado
    `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('❌ Error al obtener pedidos:', err.message);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// ✅ Obtener un pedido por ID (para editar)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(dbConfig);

    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`
        SELECT 
          pe.id,
          pe.estado,
          u.nombre AS nombre_cliente
        FROM pedidos pe
        INNER JOIN clientes c ON pe.cliente_id = c.id
        INNER JOIN usuarios u ON c.usuario_id = u.id
        WHERE pe.id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Error al obtener pedido por ID:', err.message);
    res.status(500).json({ error: 'Error al obtener pedido por ID' });
  }
});

// ✅ Actualizar solo el estado del pedido
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input('id', sql.Int, id)
      .input('estado', sql.NVarChar, estado)
      .query(`
        UPDATE pedidos
        SET estado = @estado
        WHERE id = @id
      `);

    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Error al actualizar pedido:', err.message);
    res.status(500).json({ error: 'Error al actualizar pedido' });
  }
});
// Obtener pedidos de un cliente específico
router.get('/cliente/:cliente_id', async (req, res) => {
  const { cliente_id } = req.params;

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('cliente_id', sql.Int, cliente_id)
      .query(`
        SELECT id, fecha, estado, total
        FROM pedidos
        WHERE cliente_id = @cliente_id
        ORDER BY fecha DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error al obtener pedidos del cliente:', err.message);
    res.status(500).json({ error: 'Error al obtener pedidos del cliente' });
  }
});


router.post('/', async (req, res) => {
  console.log('📥 Pedido recibido en backend:', req.body); // ← Agrega esto

  const {
    cliente_id,
    tipo_entrega,
    metodo_pago,
    direccion,
    nombre,
    total,
    productos
  } = req.body;


  try {
    const pool = await sql.connect(dbConfig);

    // 1. Insertar en PEDIDOS y obtener el ID generado
    const pedidoResult = await pool.request()
      .input('cliente_id', sql.Int, cliente_id)
      .input('tipo_entrega', sql.NVarChar, tipo_entrega)
      .input('metodo_pago', sql.NVarChar, metodo_pago)
      .input('direccion', sql.NVarChar, direccion || null)
      .input('nombre', sql.NVarChar, nombre)
      .input('total', sql.Decimal(10, 2), total)
      .input('fecha', sql.DateTime, new Date())
      .input('estado', sql.NVarChar, 'pendiente')
      .query(`
        INSERT INTO pedidos (cliente_id, fecha, estado, tipo_entrega, metodo_pago, direccion, nombre, total)
        OUTPUT INSERTED.id
        VALUES (@cliente_id, @fecha, @estado, @tipo_entrega, @metodo_pago, @direccion, @nombre, @total)
      `);

    const pedidoId = pedidoResult.recordset[0].id;

    // 2. Insertar en DETALLE_PEDIDOS
    for (const item of productos) {
      await pool.request()
        .input('pedido_id', sql.Int, pedidoId)
        .input('producto_id', sql.Int, item.producto_id)
        .input('cantidad', sql.Int, item.cantidad)
        .input('precio_unitario', sql.Decimal(10, 2), item.precio_unitario)
        .input('estado', sql.Bit, true)
        .query(`
          INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, estado)
          VALUES (@pedido_id, @producto_id, @cantidad, @precio_unitario, @estado)
        `);
    }

    res.status(201).json({ message: 'Pedido registrado', pedido_id: pedidoId });
  } catch (err) {
    console.error('❌ Error al registrar pedido:', err.message);
    res.status(500).json({ error: 'Error al registrar pedido' });
  }
});


module.exports = router;
