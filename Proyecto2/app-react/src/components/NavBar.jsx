import React from 'react';
import Grafica_Aprobados from '../Aprobados';

//import mi archivo css
import './styles/NavBar.css';

const NavBar = () => {
  //Declaro una variable donde voy a almacenar la ruta de la imagen que quiero mostrar
  const brand =
    'https://archives.bulbagarden.net/media/upload/3/3f/PCP094.png';
  //la lógica va siempre antes del return
  return (
    <header className="header">
      {/* logo de la marca */}
      <div className="logo-container">
        <img src={brand} alt="logo" />
      </div>

      {/* links de navegación */}
      <nav>
        <ul className="nav-container">
          <li>
            <a href="/Aprobados">Aprobados</a>
          </li>
          <li>
            <a href="/">Promedios</a>
          </li>
          <li>
            <a href="/">No. Alumnos</a>
          </li>
          <li>
            <a href="/">Notas x curso</a>
          </li>
        </ul>
      </nav>

      
    </header>
  );
};

export default NavBar;
