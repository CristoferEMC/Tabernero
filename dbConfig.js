const sql = require('mssql');

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

module.exports = {
    sql,
    dbConfig
};
