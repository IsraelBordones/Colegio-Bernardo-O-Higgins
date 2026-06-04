import React, { useState } from 'react';

const CalificacionesPage = () => {
    const [alumnos, setAlumnos] = useState([
        { id: 1, nombre: "Juan Perez", notas: [5.5, 6.0], editando: false },
        { id: 2, nombre: "Maria Soto", notas: [7.0, 6.5], editando: false },
        { id: 3, nombre: "Pedro Armijo", notas: [4.0, 5.2], editando: false },
    ]);

    const toggleEdit = (id) => {
        setAlumnos(alumnos.map(al => al.id === id ? { ...al, editando: !al.editando } : al));
    };

    const handleNotaChange = (alumnoId, notaIndex, valor) => {
        setAlumnos(alumnos.map(al => {
            if (al.id === alumnoId) {
                const nuevasNotas = [...al.notas];
                nuevasNotas[notaIndex] = parseFloat(valor) || 0;
                return { ...al, notas: nuevasNotas };
            }
            return al;
        }));
    };

    const agregarNota = () => {
        setAlumnos(alumnos.map(al => ({ ...al, notas: [...al.notas, 1.0], editando: true })));
    };

    const eliminarNota = () => {
        if (alumnos[0].notas.length > 1) {
            setAlumnos(alumnos.map(al => ({ ...al, notas: al.notas.slice(0, -1) })));
        }
    };

    return (
        <div className="container-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>⭐ Panel de Calificaciones</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={eliminarNota} className="btn-danger" style={{ padding: '8px 15px' }}>🗑️ Quitar Nota</button>
                    <button onClick={agregarNota} className="btn-primary">➕ Agregar Nota</button>
                </div>
            </div>
            
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Alumno</th>
                        {alumnos[0].notas.map((_, i) => <th key={i}>N{i + 1}</th>)}
                        <th>Promedio</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {alumnos.map((al) => {
                        const promedio = (al.notas.reduce((a, b) => a + b, 0) / al.notas.length).toFixed(1);
                        return (
                            <tr key={al.id}>
                                <td>{al.nombre}</td>
                                {al.notas.map((nota, index) => (
                                    <td key={index}>
                                        {al.editando ? 
                                            <input type="number" step="0.1" value={nota} onChange={(e) => handleNotaChange(al.id, index, e.target.value)} style={{ width: '45px' }} /> 
                                            : nota}
                                    </td>
                                ))}
                                <td>
                                    <span className={`badge ${promedio >= 4 ? 'badge-presente' : 'badge-ausente'}`}>
                                        {promedio}
                                    </span>
                                </td>
                                <td>
                                    <button onClick={() => toggleEdit(al.id)} className="btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>
                                        {al.editando ? '💾 OK' : '✏️ Editar'}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CalificacionesPage;