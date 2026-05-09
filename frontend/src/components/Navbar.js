import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Limpia el usuario en App.js
    navigate('/'); // Nos manda al login
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      backgroundColor: '#003366', // Azul Duoc / Institucional
      color: 'white',
      height: '60px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
        Colegio Bernardo O'Higgins
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {/* Enlaces visibles para TODOS los que estén logueados */}
        {user && (
          <>
            <Link to="/home" style={{ color: 'white', textDecoration: 'none' }}>Inicio</Link>
            <Link to="/calificaciones" style={{ color: 'white', textDecoration: 'none' }}>Calificaciones</Link>
          </>
        )}
        
        {/* Enlace visible SOLO para el PROFESOR */}
        {user?.role === 'profesor' && (
          <Link to="/asistencia" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            backgroundColor: '#00509d', 
            padding: '5px 12px', 
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>
            Pasar Asistencia
          </Link>
        )}

        {/* Bloque de usuario y botón salir */}
        {user && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px', 
            borderLeft: '1px solid rgba(255,255,255,0.3)', 
            paddingLeft: '15px' 
          }}>
            <span style={{ fontSize: '0.9rem' }}>{user.nombre}</span>
            <button 
              onClick={handleLogout} 
              style={{ 
                backgroundColor: '#d9534f', 
                color: 'white', 
                border: 'none', 
                padding: '5px 10px', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;