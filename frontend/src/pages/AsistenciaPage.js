import React, { useState } from 'react';

const AsistenciaPage = () => {
    // 1. ESTADOS
    const [asignatura, setAsignatura] = useState('');
    const [fecha, setFecha] = useState('');
    const [mensajeExito, setMensajeExito] = useState(false);
    
    // Lista de alumnos simulada con porcentajes
    const [alumnos, setAlumnos] = useState([
        { id: 1, nombre: 'William Cáceres', presente: false, porcentaje: 85 },
        { id: 2, nombre: 'Israel Bordones', presente: false, porcentaje: 65 }, // Rojo (<70)
        { id: 3, nombre: 'Juan Pérez', presente: false, porcentaje: 40 },      // Rojo (<70)
        { id: 4, nombre: 'María González', presente: false, porcentaje: 92 },
    ]);

    const hoy = new Date().toISOString().split('T')[0];

    // 2. FUNCIONES DE LÓGICA
    const toggleAsistencia = (id) => {
        setAlumnos(alumnos.map(alumno => 
            alumno.id === id ? { ...alumno, presente: !alumno.presente } : alumno
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación simple
        if (!asignatura || !fecha) {
            alert("Por favor, selecciona asignatura y fecha antes de guardar.");
            return;
        }

        // Simular envío de datos
        console.log("Guardando asistencia...", { asignatura, fecha, alumnos });

        // Mostrar mensaje de éxito
        setMensajeExito(true);

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
            setMensajeExito(false);
        }, 3000);
    };

    // 3. DISEÑO (VISTA)
    return (
        <div style={{ padding: '20px', maxWidth: '850px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
            
            {/* NOTIFICACIÓN FLOTANTE */}
            {mensajeExito && (
                <div style={{
                    position: 'fixed', top: '20px', right: '20px', backgroundColor: '#4BB543',
                    color: 'white', padding: '15px 25px', borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 1000, fontWeight: 'bold'
                }}>
                    ✅ ¡Asistencia guardada correctamente!
                </div>
            )}

            <h2 style={{ color: '#003366', borderBottom: '2px solid #003366', paddingBottom: '10px' }}>
                Registro de Asistencia - Colegio Bernardo O'Higgins
            </h2>

            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                {/* SELECTORES SUPERIORES */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Asignatura:</label>
                        <select 
                            value={asignatura} 
                            onChange={(e) => setAsignatura(e.target.value)} 
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                            <option value="">-- Seleccione Materia --</option>
                            <option value="matematica">Matemática</option>
                            <option value="programacion">Programación Avanzada</option>
                            <option value="ingles">Inglés Técnico</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Fecha:</label>
                        <input 
                            type="date" 
                            value={fecha} 
                            max={hoy} 
                            onChange={(e) => setFecha(e.target.value)} 
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
                        />
                    </div>
                </div>

                {/* TABLA DE ALUMNOS */}
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#003366', color: 'white' }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Nombre del Alumno</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Asistencia de Hoy</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>% Acumulado</th>
                            <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {alumnos.map(alumno => (
                            <tr key={alumno.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{alumno.nombre}</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={alumno.presente} 
                                        onChange={() => toggleAsistencia(alumno.id)}
                                        style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    />
                                </td>
                                <td style={{ 
                                    padding: '12px', textAlign: 'center', fontWeight: 'bold',
                                    color: alumno.porcentaje < 70 ? '#d9534f' : '#5cb85c' 
                                }}>
                                    {alumno.porcentaje}%
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    {alumno.porcentaje < 70 ? (
                                        <b style={{ color: '#d9534f', fontSize: '12px' }}>⚠️ RIESGO</b>
                                    ) : (
                                        <b style={{ color: '#5cb85c', fontSize: '12px' }}>✅ OK</b>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button 
                    type="submit" 
                    style={{
                        marginTop: '30px', width: '100%', padding: '15px', 
                        backgroundColor: '#003366', color: 'white', border: 'none', 
                        borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', 
                        cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                >
                    Finalizar y Guardar Registro
                </button>
            </form>
        </div>
    );
};

export default AsistenciaPage;