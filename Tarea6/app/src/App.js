import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:3001'; // URL del servidor Node.js

function App() {
  const [albumData, setAlbumData] = useState([]);
  const [formData, setFormData] = useState({
    album: '',
    artist: '',
    year: '',
  });

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on('newAlbumData', (data) => {
      setAlbumData([...albumData, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [albumData]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Enviar datos al servidor Node.js
    const response = await fetch('http://localhost:3001/sendData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setFormData({ album: '', artist: '', year: '' });
    }
  };

  return (
    <div className="App">
      <h1>Álbumes de Música</h1>
      <div>
        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            placeholder="Álbum"
            value={formData.album}
            onChange={(e) => setFormData({ ...formData, album: e.target.value })}
          />
          <input
            type="text"
            placeholder="Artista"
            value={formData.artist}
            onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
          />
          <input
            type="text"
            placeholder="Año"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
      <div>
        <h2>Datos de Álbumes</h2>
        <ul>
          {albumData.map((data, index) => (
            <li key={index}>
              Álbum: {data.album}, Artista: {data.artist}, Año: {data.year}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
