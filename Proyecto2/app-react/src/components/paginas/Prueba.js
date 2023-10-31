import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';

ChartJS.register(BarElement, Tooltip, Legend, CategoryScale, LinearScale);


function Prueba() {
  const [data, setData] = useState([]);
  const [semester, setSemester] = useState([]);
  const [shouldFetchData, setShouldFetchData] = useState(false);

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const fetchData = () => {
    if (semester!=='N' && semester!=='') {
    // Realiza una solicitud al backend de Node.js para obtener los datos
    const url = `http://localhost:3001/cursoAlumAsig`
    axios.post(url, {semestre: semester})  // Asegúrate de ajustar la URL a tu API backend
      .then(response => {
        const dataFromBackend = response.data;
        console.log(dataFromBackend);
        setData(dataFromBackend);
        //const parsedData = JSON.parse(dataFromBackend);
        console.log(dataFromBackend);


        //const { labels, values } = response.data;
        //console.log(labels, values);
        //setData({ labels, values });
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
    }
  };

  /*useEffect(() => {
    // Realiza una solicitud al backend de Node.js para obtener los datos
    const url = `http://localhost:3001/cursoAlumAsig`
    axios.post(url, {semestre: semester})  // Asegúrate de ajustar la URL a tu API backend
      .then(response => {
        const dataFromBackend = response.data;
        console.log(dataFromBackend);
        setData(dataFromBackend);
        //const parsedData = JSON.parse(dataFromBackend);
        console.log(dataFromBackend);


        //const { labels, values } = response.data;
        //console.log(labels, values);
        //setData({ labels, values });
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);*/
  
  useEffect(() => {
    if (shouldFetchData) {
      fetchData();
      setShouldFetchData(false); // Restablece el estado para evitar futuras solicitudes innecesarias.
    }
  }, [shouldFetchData]);

  const labels = data.map(d => d.curso);
  const values = data.map(d => d.Asignados);

  // Configuración de la gráfica de barras
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Valores',
        data: values,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2>Cursos con más alumnos</h2>
      <label htmlFor="semester">Selecciona el semestre: </label>
      <br />
      <select  id="semester" value={semester} onChange={handleSemesterChange}>
        <option value="N"></option>
        <option value="1S">1S</option>
        <option value="2S">2S</option>
      </select>
      <button onClick={() => setShouldFetchData(semester !== 'N')}>Consultar Datos</button>

      <Bar data={chartData} />
    </div>
  );
}

export default Prueba;
