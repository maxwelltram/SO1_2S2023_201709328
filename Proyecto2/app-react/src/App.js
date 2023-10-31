import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter, Route, Switch, Routes, Router } from 'react-router-dom';
//import NavBar from './components/NavBar.jsx';
import NavBar from './components/navegacion/Navbar.js';
import Prueba from './components/paginas/Prueba.js';
import Notas from './components/paginas/Notas.js';
import Inicio from './components/paginas/Inicio.js';
import PieC from './components/paginas/PieC.js';
import RedTotal from './components/paginas/RedTotal.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />

        <Routes>
          <Route path='/inicio' element={<Inicio/>}/>
          <Route path='/piec' element={<PieC/>}/>
          <Route path='/prueba' element={<Prueba/>}/>
          <Route path='/notas' element={<Notas/>}/>
          <Route path='/redtotal' element={<RedTotal/>}/>
        </Routes>

      </BrowserRouter>

    </div>
  );
}

export default App;
