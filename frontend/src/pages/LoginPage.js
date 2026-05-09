import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí simulamos la validación
    console.log("Login intentado con:", email);
    alert("Sesión iniciada correctamente.");
    navigate('/'); // Nos manda al inicio (donde está el botón de asistencia)
  };

  return (
    <div style={{ padding: '60px 20px' }}>
      <div style={{ 
        maxWidth: '350px', 
        margin: 'auto', 
        padding: '30px', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)' 
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>Acceso Docente</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Correo:</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@colegio.cl" 
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contraseña:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: '#2c3e50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Entrar al Portal
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;