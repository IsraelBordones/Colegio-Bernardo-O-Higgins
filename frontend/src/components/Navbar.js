import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    
    // Obtenemos el usuario del localStorage
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    // Si no hay nadie logueado, no mostramos el Navbar
    if (!user) {
        return null;
    }

    const handleLogout = () => {
        localStorage.clear(); // Borramos la sesión
        navigate('/');        // Volvemos al login
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#2c3e50',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                Colegio Bernardo O'Higgins
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                
                {/* ESTE BLOQUE APARECE SOLO SI ES PROFESOR */}
                {user.rol === 'profesor' && (
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Link to="/asistencia" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem' }}>
                            📋 Registrar Asistencia
                        </Link>
                        <Link to="/calificaciones" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem' }}>
                            ⭐ Notas
                        </Link>
                    </div>
                )}

                <div style={{ borderLeft: '1px solid #555', height: '20px' }}></div>

                <span>Bienvenido, <strong>{user.nombre}</strong></span>
                
                <button 
                    onClick={handleLogout}
                    style={{
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        padding: '8px 15px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
};

export default Navbar;