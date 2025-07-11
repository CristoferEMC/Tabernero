require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Configuración de conexión
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

// Conexión y carga de rutas
async function main() {
    try {
        await sql.connect(dbConfig);

        // Importar rutas
        const usuariosRoute = require('./routes/usuarios');
        const clientesRoute = require('./routes/clientes');
        const trabajadoresRoute = require('./routes/trabajadores');
        const productosRoute = require('./routes/productos');
        const pedidosRoute = require('./routes/pedidos');
        const detallePedidosRoute = require('./routes/detalle-pedidos');
        const loginRoute = require('./routes/login');
        const registroRoute = require('./routes/registro');
        



        // Registrar rutas
        app.use('/usuarios', usuariosRoute);
        app.use('/clientes', clientesRoute);
        app.use('/trabajadores', trabajadoresRoute);
        app.use('/productos', productosRoute);
        app.use('/pedidos', pedidosRoute);
        app.use('/detalle-pedidos', detallePedidosRoute);
        app.use('/login', loginRoute);
        app.use('/registro', registroRoute);

        // Ruta raíz de prueba
        // Ruta raíz: redirige al index.html
        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/public/index.html');
        });


        // Iniciar servidor
        app.listen(port, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
        });

    } catch (err) {
        console.error('❌ Error al conectar a SQL Azure o cargar rutas:', err.message);
    }
}

main();
