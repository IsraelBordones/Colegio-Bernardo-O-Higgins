import React, { useState } from 'react';

const AsistenciaPage = () => {
    const hoy = new Date().toISOString().split('T')[0];
    const [fecha, setFecha] = useState(hoy);
    const [asignatura, setAsignatura] = useState('Matemáticas');
    const [mensaje, setMensaje] = useState('');
    const [lista, setLista] = useState([
        { id: 1, nombre: "Juan Perez", estado: "Presente", diasAsistidos: 15, totalDias: 20 },
        { id: 2, nombre: "Maria Soto", estado: "Presente", diasAsistidos: 19, totalDias: 20 },
        { id: 3, nombre: "Pedro Armijo", estado: "Ausente", diasAsistidos: 10, totalDias: 20 },
    ]);

    const cambiarEstado = (id) => {
        setLista(lista.map(al => 
            al.id === id ? { ...al, estado: al.estado === "Presente" ? "Ausente" : "Presente" } : al
        ));
    };

    const guardarAsistencia = () => {
        setMensaje(`✅ Asistencia de ${asignatura} (${fecha}) guardada correctamente.`);
        setTimeout(() => setMensaje(''), 4000);
    };

    return (
        <div className="container-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>📋 Registro de Asistencia</h2>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <select value={asignatura} onChange={(e) => setAsignatura(e.target.value)} style={{ padding: '8px', borderRadius: '5px' }}>
                        <option>Matemáticas</option>
                        <option>Lenguaje</option>
                        <option>Historia</option>
                    </select>
                    <input type="date" value={fecha} max={hoy} onChange={(e) => setFecha(e.target.value)} style={{ padding: '8px', borderRadius: '5px' }} />
                </div>
            </div>

            {mensaje && <div className="badge badge-presente" style={{ display: 'block', marginBottom: '20px', padding: '15px' }}>{mensaje}</div>}

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Alumno</th>
                        <th style={{ textAlign: 'center' }}>% Asistencia</th>
                        <th style={{ textAlign: 'center' }}>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {lista.map(alumno => (
                        <tr key={alumno.id}>
                            <td>{alumno.nombre}</td>
                            <td style={{ textAlign: 'center' }}>{((alumno.diasAsistidos / alumno.totalDias) * 100).toFixed(0)}%</td>
                            <td style={{ textAlign: 'center' }}>
                                <button 
                                    onClick={() => cambiarEstado(alumno.id)}
                                    className={`badge ${alumno.estado === 'Presente' ? 'badge-presente' : 'badge-ausente'}`}
                                    style={{ cursor: 'pointer', border: 'none', width: '100px' }}
                                >
                                    {alumno.estado}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <button onClick={guardarAsistencia} className="btn-primary" style={{ marginTop: '20px', float: 'right' }}>
                💾 Guardar Cambios
            </button>
        </div>
    );
};

export default AsistenciaPage;