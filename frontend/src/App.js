import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Importamos las páginas que creaste
import AsistenciaPage from './pages/AsistenciaPage';
import LoginPage from './pages/LoginPage';

// Un pequeño componente para la pantalla de Bienvenida
const Home = () => (
  <div style={{ padding: '40px', textAlign: 'center' }}>
    <h2 style={{ color: '#2c3e50' }}>Panel de Control Escolar</h2>
    <p>Seleccione una opción en el menú superior para comenzar.</p>
    <div style={{ marginTop: '30px' }}>
      <Link to="/asistencia">
        <button style={{ padding: '15px 30px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
          Ir a Pasar Lista
        </button>
      </Link>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="App">
        {/* Encabezado Institucional */}
        <header className="App-header">
          <h1>Colegio Bernardo O'Higgins</h1>
          <nav>
            <Link to="/">Inicio</Link>
            <Link to="/asistencia">Asistencia</Link>
            <Link to="/login">Login</Link>
          </nav>
        </header>

        {/* Contenedor de Páginas */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/asistencia" element={<AsistenciaPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>

        <footer style={{ marginTop: '50px', padding: '20px', color: '#666', fontSize: '0.8rem' }}>
          © 2026 Sistema de Gestión Educativa - Portafolio Fullstack
        </footer>
      </div>
    </Router>
  );
}

export default App;