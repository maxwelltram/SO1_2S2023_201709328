const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const redis = require('redis');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);



const redisClient = redis.createClient({
  host: 'localhost', // Cambia esto si tu servidor Redis está en otro lugar
  port: 6379,        // Puerto predeterminado de Redis
});

app.use(express.json());

// Endpoint para recibir datos desde Postman y almacenarlos en Redis
app.post('/agregar-album', (req, res) => {
  const { album, artist, year } = req.body;

  // Almacena los datos en Redis
  redisClient.hset('album:', album, 'artist', artist, 'year', year);

  // Envia los datos a través de Socket.IO para actualizar en tiempo real
  io.emit('nuevo-album', { album, artist, year });

  res.status(200).json({ message: 'Álbum agregado con éxito' });
});

redisClient.on('error', (err) => {
  console.error('Error de Redis:', err);
});

server.listen(3001, () => {
  console.log('Servidor Node.js escuchando en el puerto 3001');
});

// Configura Socket.IO para escuchar conexiones
io.on('connection', (socket) => {
  console.log('Cliente conectado a Socket.IO');
});
    