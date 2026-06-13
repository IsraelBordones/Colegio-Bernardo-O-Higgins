import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService'; // El servicio que creamos antes





const LoginPage = () => {
    // Estados para capturar lo que el usuario escribe
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
            // Solo intentar login (sin chequeo previo)
            const userData = await login(username, password);


            console.log("Login exitoso:", userData);


            // Guardamos la sesión en el navegador (Local Storage)
            // Esto nos sirve para mostrar el nombre en el Header después
            localStorage.setItem('user', JSON.stringify(userData));

            // Redirección lógica según el rol
            if (userData?.rol === 'profesor') {
                navigate('/dashboard-profesor');
            } else if (typeof userData?.rol === 'string' && userData.rol.startsWith('alumno')) {
                navigate('/dashboard-alumno');
            } else if (userData?.rol === 'alumno') {
                navigate('/dashboard-alumno');
            } else {
                setError('Rol de usuario no reconocido');
            }



        } catch (err) {
            // Si el BFF devuelve 401 o hay error de red
            setError('Usuario o contraseña incorrectos. Intente de nuevo.');
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

// Estilos rápidos para que no se vea desordenado
const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f4f4' },
    form: { padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '300px' },
    inputGroup: { marginBottom: '1rem', display: 'flex', flexDirection: 'column' },
    error: { color: 'red', fontSize: '0.8rem', marginBottom: '1rem' },
    button: { width: '100%', padding: '0.7rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default LoginPage;