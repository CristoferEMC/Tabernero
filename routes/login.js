const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../dbConfig');

router.post('/', async (req, res) => {
  const { correo, contraseña } = req.body;
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT * FROM usuarios WHERE correo = ${correo} AND contraseña = ${contraseña}
    `;
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]); // Enviar el usuario logueado
    } else {
      res.status(401).send('Credenciales inválidas');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
