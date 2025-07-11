const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../dbConfig');

router.post('/', async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    await sql.connect(dbConfig);

    const result = await sql.query`
      SELECT 
        u.id AS usuario_id, 
        u.nombre, 
        u.correo, 
        u.rol, 
        c.id AS cliente_id
      FROM usuarios u
      LEFT JOIN clientes c ON u.id = c.usuario_id
      WHERE u.correo = ${correo} AND u.contraseña = ${contraseña}
    `;

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]); // Cliente o trabajador
    } else {
      res.status(401).json({ error: 'Credenciales inválidas' });
    }

  } catch (err) {
    console.error('❌ Error en login:', err.message);
    res.status(500).json({ error: 'Error del servidor' });
  }
});


module.exports = router;
