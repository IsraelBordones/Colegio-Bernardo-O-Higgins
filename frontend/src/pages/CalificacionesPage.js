import React, { useState } from 'react';

const CalificacionesPage = ({ user }) => {
    // 1. BASE DE DATOS SIMULADA
    const [alumnos, setAlumnos] = useState([
        { id: 1, nombre: 'William Cáceres', notas: [7.0, 5.5, 6.2] },
        { id: 2, nombre: 'Israel Bordones', notas: [6.8, 4.0] },
        { id: 3, nombre: 'Juan Pérez', notas: [3.5, 2.8] },
    ]);

    // 2. ESTADOS PARA LA NAVEGACIÓN INTERNA
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
    const [editandoIndex, setEditandoIndex] = useState(null);
    const [notaEditable, setNotaEditable] = useState('');

    // 3. FUNCIONES DE LÓGICA
    const seleccionarAlumno = (alumno) => {
        // Si es alumno, solo puede verse a sí mismo
        if (user.role === 'alumno' && alumno.nombre !== user.nombre) return;
        setAlumnoSeleccionado(alumno);
    };

    const guardarNota = () => {
        const valor = parseFloat(notaEditable);
        if (isNaN(valor) || valor < 1 || valor > 7) {
            alert("Ingrese una nota válida entre 1.0 y 7.0");
            return;
        }

        const nuevosAlumnos = alumnos.map(al => {
            if (al.id === alumnoSeleccionado.id) {
                const nuevasNotas = [...al.notas];
                if (editandoIndex !== null) {
                    nuevasNotas[editandoIndex] = valor; // Modificar
                } else {
                    nuevasNotas.push(valor); // Añadir nueva
                }
                const alumnoActualizado = { ...al, notas: nuevasNotas };
                setAlumnoSeleccionado(alumnoActualizado); // Actualizar vista detalle
                return alumnoActualizado;
            }
            return al;
        });

        setAlumnos(nuevosAlumnos);
        cancelarEdicion();
    };

    const eliminarNota = (index) => {
        const nuevosAlumnos = alumnos.map(al => {
            if (al.id === alumnoSeleccionado.id) {
                const nuevasNotas = al.notas.filter((_, i) => i !== index);
                const alumnoActualizado = { ...al, notas: nuevasNotas };
                setAlumnoSeleccionado(alumnoActualizado);
                return alumnoActualizado;
            }
            return al;
        });
        setAlumnos(nuevosAlumnos);
    };

    const cancelarEdicion = () => {
        setEditandoIndex(null);
        setNotaEditable('');
    };

    // Calcular promedio
    const calcularPromedio = (notas) => 
        notas.length > 0 ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1) : "0.0";

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial' }}>
            <h2 style={{ color: '#003366' }}>Gestión de Calificaciones</h2>

            {!alumnoSeleccionado ? (
                /* VISTA A: LISTA DE ALUMNOS */
                <div style={{ display: 'grid', gap: '10px' }}>
                    {alumnos.map(al => (
                        // Si es alumno, solo mostramos su propia tarjeta
                        (user.role === 'profesor' || user.nombre === al.nombre) && (
                            <div key={al.id} style={{
                                padding: '15px', border: '1px solid #ddd', borderRadius: '8px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                backgroundColor: 'white'
                            }}>
                                <div>
                                    <strong>{al.nombre}</strong>
                                    <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: '#666' }}>
                                        Promedio: {calcularPromedio(al.notas)}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => seleccionarAlumno(al)}
                                    style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '4px' }}
                                >
                                    {user.role === 'profesor' ? 'Gestionar Notas' : 'Ver mis Notas'}
                                </button>
                            </div>
                        )
                    ))}
                </div>
            ) : (
                /* VISTA B: DETALLE DEL ALUMNO */
                <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', border: '1px solid #003366' }}>
                    <button onClick={() => setAlumnoSeleccionado(null)} style={{ marginBottom: '10px', cursor: 'pointer' }}>← Volver a la lista</button>
                    <h3>Notas de: {alumnoSeleccionado.nombre}</h3>

                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {alumnoSeleccionado.notas.map((nota, idx) => (
                            <li key={idx} style={{ 
                                padding: '10px', borderBottom: '1px solid #eee', 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
                            }}>
                                <span style={{ fontWeight: 'bold', color: nota < 4 ? 'red' : 'black' }}>
                                    Nota {idx + 1}: {nota.toFixed(1)}
                                </span>
                                {user.role === 'profesor' && (
                                    <div>
                                        <button onClick={() => { setEditandoIndex(idx); setNotaEditable(nota); }} style={{ marginRight: '5px' }}>✏️</button>
                                        <button onClick={() => eliminarNota(idx)} style={{ color: 'red' }}>🗑️</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>

                    {user.role === 'profesor' && (
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#eee', borderRadius: '5px' }}>
                            <h4>{editandoIndex !== null ? 'Modificar Nota' : 'Añadir Nueva Nota'}</h4>
                            <input 
                                type="number" step="0.1" value={notaEditable} 
                                onChange={(e) => setNotaEditable(e.target.value)}
                                placeholder="Ej: 7.0"
                                style={{ padding: '8px', width: '80px', marginRight: '10px' }}
                            />
                            <button onClick={guardarNota} style={{ backgroundColor: '#5cb85c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px' }}>
                                {editandoIndex !== null ? 'Actualizar' : 'Guardar'}
                            </button>
                            {editandoIndex !== null && <button onClick={cancelarEdicion} style={{ marginLeft: '10px' }}>Cancelar</button>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CalificacionesPage;