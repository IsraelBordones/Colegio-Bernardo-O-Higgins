import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';

// Importamos tus páginas reales
import AsistenciaPage from './pages/AsistenciaPage';
import CalificacionesPage from './pages/CalificacionesPage';

// Dashboards simples
const DashboardProfesor = () => (
    <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Área del Docente</h1>
        <p>Selecciona una opción en el menú superior para comenzar.</p>
    </div>
);

const DashboardAlumno = () => (
    <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1>Área del Estudiante</h1>
        <p>Aquí podrás revisar tus calificaciones actuales.</p>
    </div>
);

function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<LoginPage />} />
        
        {/* Rutas de Dashboard */}
        <Route path="/dashboard-profesor" element={<DashboardProfesor />} />
        <Route path="/dashboard-alumno" element={<DashboardAlumno />} />
        
        {/* Rutas de Funcionalidades para el Profesor */}
        <Route path="/asistencia" element={<AsistenciaPage />} />
        <Route path="/calificaciones" element={<CalificacionesPage />} />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;