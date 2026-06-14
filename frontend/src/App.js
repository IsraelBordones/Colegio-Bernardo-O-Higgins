import React, { useState } from 'react';
import Login from './pages/Login';
import DashboardAlumno from './pages/DashboardAlumno';
import DashboardProfesor from './pages/DashboardProfesor';

function App() {
  const [usuario, setUsuario] = useState(() => {
    // Recuperar sesión del sessionStorage al recargar
    const stored = sessionStorage.getItem('usuario');
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogin = (userData) => {
    sessionStorage.setItem('usuario', JSON.stringify(userData));
    setUsuario(userData);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('usuario');
    setUsuario(null);
  };

  if (!usuario) {
    return <Login onLogin={handleLogin} />;
  }

  const rol = (usuario.rol || usuario.role || '').toUpperCase();

  if (rol === 'PROFESOR' || rol === 'TEACHER') {
    return <DashboardProfesor usuario={usuario} onLogout={handleLogout} />;
  }

  // Por defecto: vista alumno
  return <DashboardAlumno usuario={usuario} onLogout={handleLogout} />;
}

export default App;
