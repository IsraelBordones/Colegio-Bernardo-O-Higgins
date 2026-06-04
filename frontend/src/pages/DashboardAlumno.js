import React from 'react';

const DashboardAlumno = () => {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    // Datos simulados del progreso del alumno
    const misAsignaturas = [
        { id: 1, nombre: "Matemáticas", notas: [5.5, 6.2, 5.8], asistencia: 95 },
        { id: 2, nombre: "Lenguaje y Comunicación", notas: [6.0, 7.0], asistencia: 100 },
        { id: 3, nombre: "Historia y Geografía", notas: [4.5, 3.8, 5.0], asistencia: 85 },
        { id: 4, nombre: "Ciencias Naturales", notas: [5.2], asistencia: 92 },
    ];

    if (!user) return <div className="container-card">Cargando...</div>;

    return (
        <div className="container-card">
            <div style={{ borderBottom: '2px solid #eee', marginBottom: '30px', paddingBottom: '10px' }}>
                <h1>🎓 Mi Portal Académico</h1>
                <p>Bienvenido, <strong>{user.nombre}</strong> | RUN: 12.345.678-9</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={styles.statBox}>
                    <span style={styles.statLabel}>Promedio General</span>
                    <span style={styles.statValue}>5.7</span>
                </div>
                <div style={styles.statBox}>
                    <span style={styles.statLabel}>Asistencia Total</span>
                    <span style={styles.statValue}>93%</span>
                </div>
                <div style={styles.statBox}>
                    <span style={styles.statLabel}>Situación Final</span>
                    <span className="badge badge-presente">Promovido</span>
                </div>
            </div>

            <h3>📊 Resumen de Asignaturas</h3>
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Asignatura</th>
                        <th>Calificaciones</th>
                        <th style={{ textAlign: 'center' }}>Asistencia</th>
                        <th style={{ textAlign: 'center' }}>Promedio</th>
                    </tr>
                </thead>
                <tbody>
                    {misAsignaturas.map((ramo) => {
                        const suma = ramo.notas.reduce((a, b) => a + b, 0);
                        const promedio = (suma / ramo.notas.length).toFixed(1);
                        
                        return (
                            <tr key={ramo.id}>
                                <td style={{ fontWeight: '500' }}>{ramo.nombre}</td>
                                <td>{ramo.notas.join(' - ')}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <span className={`badge ${ramo.asistencia >= 85 ? 'badge-presente' : 'badge-ausente'}`}>
                                        {ramo.asistencia}%
                                    </span>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <strong style={{ color: promedio >= 4 ? '#27ae60' : '#e74c3c' }}>
                                        {promedio}
                                    </strong>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    statBox: {
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.02)'
    },
    statLabel: { fontSize: '0.9rem', color: '#666', marginBottom: '5px' },
    statValue: { fontSize: '1.8rem', fontWeight: 'bold', color: '#2c3e50' }
};

export default DashboardAlumno;