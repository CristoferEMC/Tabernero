const express = require('express');
const sql = require('mssql');
const app = express();
const port = 3000;
app.use(express.static('public'));

// Configura los datos de conexión
const dbConfig = {
    user: 'adminsql',
    password: 'Tabernero2025!',
    server: 'servidorsql25.database.windows.net',
    database: 'dbazure',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

app.get('/', async (req, res) => {
    try {
        await sql.connect(dbConfig);
        res.send('✅ Conexión exitosa a SQL Azure 🎉');
    } catch (err) {
        console.error(err);
        res.status(500).send('❌ Error en la conexión a SQL');
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
