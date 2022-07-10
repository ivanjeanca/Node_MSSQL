const sql = require("mssql");

const dbSettings = {
  user: 'ptovtaadm',
  password: 'ptovta123',
  server: 'localhost',
  database: 'punto_venta',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const getConnection = async () => {
  try {
    const pool = await sql.connect(dbSettings);
    return pool;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
    dbSettings,
    getConnection,
}