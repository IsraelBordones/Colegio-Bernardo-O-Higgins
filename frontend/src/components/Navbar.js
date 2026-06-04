import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user) return null;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <nav className="navbar-custom">
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                Colegio Bernardo O'Higgins
            </div>
            
            <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {user.rol === 'alumno' && (
                    <Link title="Libro de clases" to="/dashboard-alumno">📚 Mi libro</Link>
                )}
                {user.rol === 'profesor' && (

                    <>
                        <Link title="Libro de clases" to="/dashboard-profesor">📚 Libro</Link>
                        <Link to="/asistencia">📋 Asistencia</Link>
                        <Link to="/calificaciones">⭐ Notas</Link>
                    </>
                )}


                <span style={{ borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '20px' }}>
                    Hola, <strong>{user.nombre}</strong>
                </span>
                
                <button onClick={handleLogout} className="btn-danger">
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
};

export default Navbar;