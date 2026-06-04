import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import AsistenciaPage from './pages/AsistenciaPage';
import CalificacionesPage from './pages/CalificacionesPage';
import DashboardAlumno from './pages/DashboardAlumno'; // legado
import LibroClaseAlumno from './pages/LibroClaseAlumno';
import LibroClaseProfesor from './pages/LibroClaseProfesor';


const DashboardProfesor = () => (
    <div className="container-card" style={{ textAlign: 'center' }}>
        <h1>🍎 Panel del Docente</h1>
        <p>Utilice el menú superior para gestionar asistencia y calificaciones.</p>
    </div>
);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard-profesor" element={<LibroClaseProfesor />} />
        <Route path="/dashboard-alumno" element={<LibroClaseAlumno />} /> {/* reemplazado por libro de clases */}

        <Route path="/asistencia" element={<AsistenciaPage />} />
        <Route path="/calificaciones" element={<CalificacionesPage />} />
        <Route path="/libro-alumno" element={<LibroClaseAlumno />} />
        <Route path="/libro-profesor" element={<LibroClaseProfesor />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;