import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2'; // Importa el componente Pie de react-chartjs-2
import '../styles/styles.css';

function PieC() {
  const [data, setData] = useState([]);
    const [hasFetchedData, setHasFetchedData] = useState(false);
    const [semester, setSemester] = useState('2S');
    const [curso, setCurso] = useState('SO1');

  

  /*const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const handleCursoChange = (event) => {
    setCurso(event.target.value);
  };*/

  useEffect(() => {
    if (!hasFetchedData ) {
      // Realiza una solicitud al backend de Node.js para obtener los datos
      //axios.get(`http://localhost:3001/aprobacionCurSem?semester=${semester}&curso=${curso}`)
      axios.get(`http://localhost:3001/aprobacionCurSem?semester=${semester}&curso=${curso}`)
        .then(response => {
          const dataFromBackend = response.data;
          setData(dataFromBackend);
          setHasFetchedData(true);
        })
        .catch(error => {
          console.error('Error al obtener los datos:', error);
        });
    }
  }, [hasFetchedData, semester, curso
]);

  // Asegúrate de que la instancia de la gráfica se cree una vez
  useEffect(() => {
    if (data.length > 0  ) {
      const labels =  data.map(d => d.aprobados) ;
      const label2 =  data.map(d => d.reprobados);
      const values =  data.map(d => d.aprobados);
      const value2 =  data.map(d => d.reprobados);

      const chartData = {
        labels: [labels,label2,],
        datasets: [
          {
            data: [values,value2,],
            backgroundColor: ['red', 'green'], // Colores para las categorías
          },
        ],
      };
    }
  } , [data]);

  return (
    <div>
      <h2>Gráfica de Pastel</h2>
      <label htmlFor="semester">Selecciona el curso y semestre: </label>
      <br />
      <select id="curso" value={curso} onChange={handleCursoChange}>
        <option value="SO1">SO1</option>
        <option value="BD1">BD1</option>
        <option value="LFP">LFP</option>
        <option value="SA">SA</option>
        <option value="AYD">AYD</option>
      </select>
      <select id="semester" value={semester} onChange={handleSemesterChange}>
        <option value="1S">1S</option>
        <option value="2S">2S</option>
      </select>
      <button onClick={() => setHasFetchedData(false)}>Consultar Datos</button>
      <Pie data={data} /> {/* Utiliza el componente Pie de react-chartjs-2 para renderizar la gráfica */}
    </div>
  );
}

export default PieC;
