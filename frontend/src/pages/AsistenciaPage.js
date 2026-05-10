import React, { useState } from 'react';

const AsistenciaPage = () => {
    // Obtenemos la fecha actual para el límite del calendario
    const hoy = new Date().toISOString().split('T')[0];
    
    // Estados para los filtros
    const [fecha, setFecha] = useState(hoy);
    const [asignatura, setAsignatura] = useState('Matemáticas');
    const [mensaje, setMensaje] = useState('');

    // Lista de asignaturas disponibles
    const asignaturas = [
        "Matemáticas",
        "Lenguaje y Comunicación",
        "Historia, Geografía y Ciencias Sociales",
        "Ciencias Naturales",
        "Inglés",
        "Educación Física"
    ];

    // Lista de alumnos con su historial
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
        // En un caso real, aquí enviaríamos fecha + asignatura + lista al backend
        setMensaje(`✅ Asistencia de ${asignatura} para el día ${fecha} guardada correctamente.`);
        setTimeout(() => setMensaje(''), 4000);
    };

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2>📋 Registro de Asistencia</h2>
                
                <div style={{ 
                    display: 'flex', 
                    gap: '20px', 
                    backgroundColor: '#f8f9fa', 
                    padding: '20px', 
                    borderRadius: '8px',
                    alignItems: 'flex-end',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: 'bold' }}>Asignatura / Ramo:</label>
                        <select 
                            value={asignatura} 
                            onChange={(e) => setAsignatura(e.target.value)}
                            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '200px' }}
                        >
                            {asignaturas.map((ramo, index) => (
                                <option key={index} value={ramo}>{ramo}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: 'bold' }}>Fecha:</label>
                        <input 
                            type="date" 
                            value={fecha} 
                            max={hoy}
                            onChange={(e) => setFecha(e.target.value)}
                            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                    </div>
                </div>
            </div>

            {mensaje && (
                <div style={{ 
                    backgroundColor: '#d4edda', 
                    color: '#155724', 
                    padding: '15px', 
                    borderRadius: '5px', 
                    marginTop: '20px', 
                    border: '1px solid #c3e6cb', 
                    fontWeight: 'bold' 
                }}>
                    {mensaje}
                </div>
            )}

            <div style={{ marginTop: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <div style={{ 
                    display: 'flex', 
                    padding: '15px', 
                    borderBottom: '2px solid #eee', 
                    fontWeight: 'bold', 
                    backgroundColor: '#f8f9fa' 
                }}>
                    <div style={{ flex: 2 }}>Nombre del Alumno</div>
                    <div style={{ flex: 1, textAlign: 'center' }}>% Asistencia Total</div>
                    <div style={{ flex: 1, textAlign: 'center' }}>Estado en {asignatura}</div>
                </div>

                {lista.map(alumno => {
                    const porcentaje = ((alumno.diasAsistidos / alumno.totalDias) * 100).toFixed(0);
                    return (
                        <div key={alumno.id} style={{ display: 'flex', padding: '15px', borderBottom: '1px solid #eee', alignItems: 'center' }}>
                            <div style={{ flex: 2 }}>{alumno.nombre}</div>
                            <div style={{ flex: 1, textAlign: 'center' }}>{porcentaje}%</div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <button 
                                    onClick={() => cambiarEstado(alumno.id)}
                                    style={{
                                        backgroundColor: alumno.estado === "Presente" ? "#2ecc71" : "#e74c3c",
                                        color: 'white', 
                                        border: 'none', 
                                        padding: '8px 15px', 
                                        borderRadius: '5px', 
                                        cursor: 'pointer', 
                                        width: '100px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {alumno.estado}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <button 
                onClick={guardarAsistencia}
                style={{ 
                    marginTop: '20px', 
                    padding: '12px 25px', 
                    backgroundColor: '#2c3e50', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    cursor: 'pointer', 
                    float: 'right', 
                    fontWeight: 'bold' 
                }}
            >
                💾 Guardar Asistencia
            </button>
        </div>
    );
};

export default AsistenciaPage;