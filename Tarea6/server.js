const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const redis = require('redis');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configura la conexión a Redis
const redisClient = redis.createClient();

redisClient.on('connect', () => {
  console.log('Conexión a Redis establecida');
});

redisClient.on('error', (error) => {
  console.error('Error de Redis:', error);
});

// Configura Socket.io para recibir y emitir eventos
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Escucha un evento para recibir datos desde el cliente
  socket.on('albumData', (data) => {
    // Almacena los datos en Redis
    redisClient.RPUSH('albumDataList', JSON.stringify(data));

    // Emite los datos a todos los clientes conectados
    io.emit('newAlbumData', data);
  });

  // Cierra la conexión del cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

app.post('/sendData', (req, res) => {
    const albumData = req.body; // Los datos enviados desde la API Go
  
    // Almacena los datos en Redis
    redisClient.RPUSH('albumDataList', JSON.stringify(albumData), (err, reply) => {
      if (err) {
        // Maneja los errores de Redis aquí
        console.error('Error al almacenar en Redis:', err);
        res.status(500).send('Error al almacenar en Redis');
      } else {
        // Los datos se han almacenado con éxito en Redis
        console.log('Datos almacenados en Redis:', albumData);
        res.status(200).send('Datos recibidos y almacenados en Redis con éxito');
      }
    });
});
  

server.listen(3001, () => {
  console.log('Servidor Socket.io escuchando en el puerto 3002');
});
