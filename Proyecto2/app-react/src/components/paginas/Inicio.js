import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/styles.css';

function Inicio() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Realiza una solicitud al backend de Node.js para obtener los datos
    axios.get('http://localhost:3001/todosAlumnos') // Reemplaza con la URL correcta
      .then(response => {
        const dataFromBackend = response.data;
        setData(dataFromBackend);
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  return (
    <div>
      <h2>Tabla de Datos</h2>
      <table>
        <thead>
          <tr>
            <th>Carnet</th>
            <th>Nombre</th>
            <th>Curso</th>
            <th>Nota</th>
            <th>Semestre</th>
            <th>Anio</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.carnet}</td>
              <td>{item.nombre}</td>
              <td>{item.curso}</td>
              <td>{item.nota}</td>
              <td>{item.semestre}</td>
              <td>{item.anio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inicio;