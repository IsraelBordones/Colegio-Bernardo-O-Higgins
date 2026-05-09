import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage'; 
import AsistenciaPage from './pages/AsistenciaPage';
import CalificacionesPage from './pages/CalificacionesPage'; // NUEVA
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState({
    nombre: 'William Cáceres',
    role: 'alumno' // Prueba cambiando a 'alumno'
  });

  const logout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={logout} />

      <div style={{ marginTop: '20px' }}>
        <Routes>
          <Route path="/" element={<LoginPage setUser={setUser} />} />

          {/* RUTA ASISTENCIA: Solo Profesores */}
          <Route 
            path="/asistencia" 
            element={
              user?.role === 'profesor' ? <AsistenciaPage /> : <Navigate to="/home" />
            } 
          />

          {/* RUTA CALIFICACIONES: Todos los logueados */}
          <Route 
            path="/calificaciones" 
            element={
              user ? <CalificacionesPage user={user} /> : <Navigate to="/" />
            } 
          />

          <Route 
            path="/home" 
            element={
              user ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                  <h1>Bienvenido, {user.nombre}</h1>
                  <p>Panel de control del {user.role}</p>
                </div>
              ) : <Navigate to="/" />
            } 
          />

          <Route path="*" element={<Navigate to={user ? "/home" : "/"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;