import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userData = await login(username, password);

            console.log("Login exitoso:", userData);

            // Guardamos la sesión en el navegador
            localStorage.setItem('user', JSON.stringify(userData));

            // El BFF devuelve el campo como "rol" (UsuarioDTO.java)
            // Normalizamos a minúsculas por si acaso
            const rol = (userData?.rol || '').toLowerCase().trim();

            if (rol === 'profesor') {
                navigate('/dashboard-profesor');
            } else if (rol === 'alumno' || rol.startsWith('alumno')) {
                navigate('/dashboard-alumno');
            } else {
                // Mostramos el rol recibido para ayudar a depurar
                setError(
                    `Rol no reconocido: "${userData?.rol || 'vacío'}". ` +
                    `Revisa el campo "role" en la tabla de usuarios de la base de datos.`
                );
            }

        } catch (err) {
            // Mostramos el mensaje real del error (red, CORS, credenciales, etc.)
            setError(err.message || 'Error desconocido. Revisa la consola del navegador.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>Colegio Bernardo O'Higgins</h2>
                <h3>Iniciar Sesión</h3>

                {error && <p style={styles.error}>{error}</p>}

                <div style={styles.inputGroup}>
                    <label>Usuario (RUT o Apodo):</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Ej: william"
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="****"
                    />
                </div>

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? 'Cargando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f4f4' },
    form: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '320px' },
    inputGroup: { marginBottom: '1rem', display: 'flex', flexDirection: 'column' },
    error: { color: '#c0392b', fontSize: '0.85rem', marginBottom: '1rem', backgroundColor: '#fdecea', padding: '0.6rem', borderRadius: '4px', lineHeight: '1.4' },
    button: { width: '100%', padding: '0.7rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default LoginPage;