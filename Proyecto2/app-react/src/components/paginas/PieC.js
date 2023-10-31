import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import { Chart } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js'
Chart.register(ArcElement);

function PieC() {
  const [data, setData] = useState([]);
  const [hasFetchedData, setHasFetchedData] = useState(false);
  let [chartInstance, setChartInstance] = useState(null);
  const [semester, setSemester] = useState([]);
  const [curso, setCurso] = useState([]);
  const [shouldFetchData, setShouldFetchData] = useState(false);

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const handleCursoChange = (event) => {
    setCurso(event.target.value);
  };


  const fetchData = () => {

    const url = `http://localhost:3001/aprobacionCurSem`;
    // Realiza una solicitud al backend de Node.js para obtener los datos
    console.log(semester + ' grafica pieeeeee semestre');
    console.log(curso + ' grafica pieeeeee curos');
    axios.post(url, { semestre: semester, curso: curso })
      .then(response => {
        console.log(response.data + "data recibidaaaaaa");
        const dataFromBackend = response.data;
        setData(dataFromBackend);
        console.log(dataFromBackend + "DATA EXTRAIDA");
        //setHasFetchedData(true);
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });

  };

  useEffect(() => {
    if (shouldFetchData) {
      fetchData();
      setShouldFetchData(false); // Restablece el estado para evitar futuras solicitudes innecesarias.
    }
  }, [shouldFetchData]);

  // Asegúrate de que la instancia de la gráfica se cree una vez
  //useEffect(() => {
  //if (data.length > 0 && chartInstance === null) {

  useEffect(() => {
    if (data.length > 0) {
      // Crear la gráfica de pastel aquí
      const labels = data.map(d => d.aprobados);
      const label2 = data.map(d => d.reprobados);
      const values = data.map(d => d.aprobados);
      const value2 = data.map(d => d.reprobados);
      
      const chartData = {
        labels: ['Aprobados', 'Reprobados'],
        datasets: [
          {
            data: [values, value2],
            backgroundColor: ['red', 'green'], // Colores para las categorías
          },
        ],
      };

      const canvas = document.getElementById('myCanvas');

      if (canvas) {
        if (chartInstance) {
          chartInstance.destroy(); // Destruye el gráfico anterior si existe.
        }
        
        chartInstance = new Chart(canvas, {
          type: 'pie',
          data: chartData,
        });
        setChartInstance(chartInstance);
      }
    }
  }, [data]);


  return (
    <div>
      <h2>Gráfica de Pastel</h2>
      <label htmlFor="semester">Selecciona el curso y semestre: </label>
      <br />
      <select id="curso" value={curso} onChange={handleCursoChange}>
        <option value="N"></option>
        <option value="SO1">SO1</option>
        <option value="BD1">BD1</option>
        <option value="LFP">LFP</option>
        <option value="SA">SA</option>
        <option value="AYD">AYD</option>
      </select>
      <select id="semester" value={semester} onChange={handleSemesterChange}>
        <option value="N"></option>
        <option value="1S">1S</option>
        <option value="2S">2S</option>
      </select>
      <button onClick={() => setShouldFetchData(semester !== 'N' && curso !== 'N')}>Consultar Datos</button>
      <canvas id="myCanvas" width="200" height="200"></canvas>
    </div>
  );
}

export default PieC;
