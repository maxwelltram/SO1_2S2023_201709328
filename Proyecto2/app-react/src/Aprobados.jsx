import React, { useState } from 'react';
import logo from './logo.svg';
import { useNavigate } from 'react-router-dom';


function Grafica_Aprobados(){
    return (
        <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> hola.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
}


export default Grafica_Aprobados;