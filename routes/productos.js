const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../dbConfig');

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

module.exports = router;
