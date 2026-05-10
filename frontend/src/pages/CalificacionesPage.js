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

    const agregarNotaNueva = () => {
        setAlumnos(alumnos.map(al => ({
            ...al,
            notas: [...al.notas, 1.0],
            editando: true
        })));
    };

    const eliminarUltimaNota = () => {
        if (alumnos[0].notas.length <= 1) {
            alert("Debe haber al menos una nota registrada.");
            return;
        }
        if (window.confirm("¿Estás seguro de eliminar la última columna de notas?")) {
            setAlumnos(alumnos.map(al => ({
                ...al,
                notas: al.notas.slice(0, -1) // Quita el último elemento del array
            })));
        }
    };

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>⭐ Panel de Calificaciones</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={eliminarUltimaNota} style={{ backgroundColor: '#c0392b', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        🗑️ Eliminar Última Nota
                    </button>
                    <button onClick={agregarNotaNueva} style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        ➕ Agregar Nueva Nota
                    </button>
                </div>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white' }}>
                <thead>
                    <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                        <th style={styles.th}>Alumno</th>
                        {alumnos[0].notas.map((_, i) => (
                            <th key={i} style={styles.th}>Nota {i + 1}</th>
                        ))}
                        <th style={styles.th}>Promedio</th>
                        <th style={styles.th}>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {alumnos.map((al) => {
                        const promedio = al.notas.length > 0 
                            ? (al.notas.reduce((a, b) => a + b, 0) / al.notas.length).toFixed(1)
                            : "0.0";
                        return (
                            <tr key={al.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={styles.td}>{al.nombre}</td>
                                {al.notas.map((nota, index) => (
                                    <td key={index} style={styles.td}>
                                        {al.editando ? 
                                            <input type="number" step="0.1" value={nota} onChange={(e) => handleNotaChange(al.id, index, e.target.value)} style={styles.input} /> 
                                            : nota}
                                    </td>
                                ))}
                                <td style={styles.td}>
                                    <strong style={{ color: promedio >= 4 ? '#27ae60' : '#c0392b' }}>{promedio}</strong>
                                </td>
                                <td style={styles.td}>
                                    <button onClick={() => toggleEdit(al.id)} style={{ ...styles.btn, backgroundColor: al.editando ? '#2c3e50' : '#3498db' }}>
                                        {al.editando ? '💾 Guardar' : '✏️ Editar'}
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

const styles = {
    th: { padding: '15px', textAlign: 'left' },
    td: { padding: '15px' },
    input: { width: '50px', padding: '5px', borderRadius: '4px', border: '1px solid #ccc' },
    btn: { color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }
};

export default CalificacionesPage;