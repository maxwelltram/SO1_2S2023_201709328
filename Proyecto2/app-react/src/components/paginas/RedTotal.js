import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { Line } from 'react-chartjs-2';

const socket = socketIOClient('http://localhost:3300');  // Reemplaza con la URL de tu servidor Flask

function App() {
  const [totalDataCounts, setTotalDataCounts] = useState([]);

  useEffect(() => {
    socket.on('total_data_count', (data) => {
      setTotalDataCounts((prevCounts) => [...prevCounts, data.count]);
    });
  }, []);

  const data = {
    labels: totalDataCounts.map((_, index) => `Time ${index}`),
    datasets: [
      {
        label: 'Total Data Count',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: totalDataCounts,
      },
    ],
  };

  return (
    <div>
      <h1>Total Data Count in Redis</h1>
      <Line data={data} />
    </div>
  );
}

export default App;
