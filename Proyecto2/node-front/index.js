const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;
const db = require('./db-config');
// db-config.js
//const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Allow requests from 'http://localhost:3000'
const corsOptions = {
    origin: 'http://localhost:3000',
  };

  app.use(cors(corsOptions));
  app.use(bodyParser.json());
/*const dbConnection = mysql.createConnection({
  host: '35.245.80.91', // Dirección del servidor de MySQL
  user: 'root', // Nombre de usuario de MySQL
  password: 'Olakeas123**', // Contraseña de MySQL
  database: 'alumno', // Nombre de la base de datos
});

dbConnection.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log('Conectado a la base de datos');
    }
});*/

//module.exports = dbConnection;




//dbConnection = require('./db-config');

/*dbConnection.connect((err) => {
if (err) {
  console.error('Error al conectar a la base de datos:', err);
  return;
}
console.log('Conexión a la base de datos exitosa');*/

// Ejecutar consultas SQL aquí


// TODOS LOS ALUMNOS 
app.get('/todosAlumnos', (req, res) => {
    const consulta = 'SELECT *  FROM calificacion ORDER BY carnet ASC';
    db.query(consulta, (err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).json(results);
        //const jsonData = JSON.stringify(results);
        //res.json(results);
        //console.log(jsonData+" Data enviada");
        //res.send(jsonData);

    });
});

// PORCENTAJE DE APROBACION POR CURSO Y SEMESTRE
/*app.get('/aprobacionCurSem', (req, res) => {
    const { semester, curso } = req.query;
    console.log(semester);
    console.log(curso);
    const consulta = 'SELECT SUM(CASE WHEN nota >= 60 THEN 1 ELSE 0 END) AS aprobados, SUM(CASE WHEN nota < 60 THEN 1 ELSE 0 END) AS reprobados FROM calificacion WHERE semestre = \''+semester+'\' AND curso=\''+curso+'\'';
    console.log(consulta);
    db.query(consulta, (err, results) => {
        if (err) {
            throw err;
        }
        const jsonData = JSON.stringify(results);
        //res.json(results);
        console.log(jsonData+" Data enviada");
        res.send(jsonData);

    });
});*/

app.post('/aprobacionCurSem', (req, res) => {
    const { semestre, curso } = req.body;
    console.log(semestre);
    console.log(curso);
    const consulta = 'SELECT SUM(CASE WHEN nota >= 60 THEN 1 ELSE 0 END) AS aprobados, SUM(CASE WHEN nota < 60 THEN 1 ELSE 0 END) AS reprobados FROM calificacion WHERE semestre =\''+semestre+'\' AND curso=\''+curso+'\'';
    console.log(consulta);
    db.query(consulta, (err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).json(results);
        console.log(results);
        //const jsonData = JSON.stringify(results);
        //res.json(results);
        //console.log(jsonData+" Data enviada");
        //res.send(jsonData);

    });
});



// CONSULTA PROMEDIO DE ESTUDIANTES EN UN SEMESTRE  
app.post('/calificacionProm', (req, res) => {
    //console.log(req+"----------------------------"+req.body);
    const { semestre } = req.body;
    //console.log(semestre+" Semestre de NODEeeee");
    const consulta = 'SELECT  carnet,AVG(nota) as promedio FROM calificacion WHERE  semestre=\''+semestre+'\' GROUP BY carnet LIMIT 5';
    //console.log(consulta);
    db.query(consulta, (err, results) => {
        if (err) {
            throw err;
        }
        //const jsonData = JSON.stringify(results);
        //res.json(results);
        //console.log(jsonData+" Data enviada");
        //res.send(jsonData);
        res.status(200).json(results);
        console.log(results);
    });
});

// CONSULTA CURSOS CON MAYOR NUMERO DE ALUMNOS
app.post('/cursoAlumAsig', (req, res) => {
    const { semestre } = req.body;
    const consulta = 'SELECT  curso, COUNT(curso) as Asignados FROM calificacion WHERE semestre=\''+semestre+'\' GROUP BY curso LIMIT 3';
    db.query(consulta, (err, results) => {
        if (err) {
            throw err;
        }
        //const jsonData = JSON.stringify(results);
        //res.json(results);
        //console.log(jsonData+" Data enviada");
        //res.send(jsonData);
        res.status(200).json(results);
        console.log(results);
        
    });
});

// CONSULTA CANTIDAD DE NOTAS POR CURSO
app.get('/cursoNotCur', (req, res) => {
    const consulta = 'SELECT curso, COUNT(nota) as CantidadDeNotas  FROM calificacion WHERE semestre=\'1S\' GROUP BY curso';
    db.query(consulta, (err, results) => {
        if (err) {
            throw err;
        }
        console.log(results);
        //res.json(results);

    });
});

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

var server = require('http').createServer(app);
var io = require('socket.io')(server, { 
  cors:{
  origin: '*', // reemplaza esto con la URL de tu cliente
  optionsSuccessStatus: 200, // para soporte de navegadores antiguos
  methods: 'GET,PUT,POST,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true // habilita las credenciales de origen cruzado
  }
});

"use strict";

const Redis = require("ioredis");

class RedisConnection {
    constructor() {
        this.client = new Redis({
            host: '172.20.0.2', // reemplaza esto con tu host
            port: 6379, // reemplaza esto con tu puerto
        });

        this.client.on('connect', () => {
            console.log('Conectado a Redis');
        });

        this.client.on('error', (err) => {
            console.log('Error de Redis:', err);
        });
    }

    async get(key){
        return await this.client.get(key);
    }

    async set(key, value){
        return await this.client.set(key, value);
    }

    async keys(pattern){
        return await this.client.keys(pattern);
    }
}

// Uso
const redisClient = new RedisConnection();




io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado');

  // Obtener cantidad total de registros en tiempo real
  try {
    const keys = await redisClient.keys('*');
    console.log(keys);
    const totalRegistros = keys.length;
    socket.emit('totalRegistros', totalRegistros);
    console.log('Total de registros: ', totalRegistros);
  } catch (err) {
    console.error(err);
  }
    
  // Escuchar solicitudes de cantidad de alumnos en un curso y semestre específico
  socket.on('alumnosCursoSemestre', async (data) => {
    const { semestre, curso } = data;
    const claveRedis = `nota:AYD1:1S`;
    const claveRedis2 = `nota:${curso}:${semestre}`;
    const claveRedis3 = `nota:${curso}:${semestre}`;

    try {
      const alumnos = await redisClient.keys(claveRedis);
      const cantidadAlumnos = alumnos.length;
      socket.emit('cantidadAlumnos', cantidadAlumnos);
      console.log(`Cantidad de alumnos en el curso ${curso} y semestre ${semestre}: `, cantidadAlumnos);
    } catch (error) {
      console.error(error);
    }
  });
});




// Inicia el servidor
server.listen(8000, function () {
  console.log('Servidor iniciado en el puerto 8000');
});

// ...




// Cerrar la conexión cuando hayas terminado
//dbConnection.end();
//});
