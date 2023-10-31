const mysql = require('mysql2');

const dbConnection = mysql.createConnection({
  host: '35.245.80.91', // Dirección del servidor de MySQL
  user: 'root', // Nombre de usuario de MySQL
  password: 'Olakeas123**', // Contraseña de MySQL
  database: 'alumno', // Nombre de la base de datos
});

dbConnection.connect(function(error) {
  if (error) {
    throw error;
  } else {
    console.log('Conectado a la base de datos');
  }
});

module.exports = dbConnection;
