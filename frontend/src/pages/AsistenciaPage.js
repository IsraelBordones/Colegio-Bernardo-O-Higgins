import React, { useState } from 'react';

const AsistenciaPage = () => {
  const [asignatura, setAsignatura] = useState('');
  const [fecha, setFecha] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // 1. Lista de alumnos (puedes cambiar estos nombres por los de tu curso)
  const [alumnos, setAlumnos] = useState([
    { id: 1, nombre: 'William Cáceres', presente: false },
    { id: 2, nombre: 'Israel Bordones', presente: false },
    { id: 3, nombre: 'Juan Pérez', presente: false },
    { id: 4, nombre: 'María González', presente: false },
  ]);

  const hoy = new Date().toISOString().split('T')[0];

  // 2. Función para cambiar el estado de un alumno (Presente/Ausente)
  const toggleAsistencia = (id) => {
    setAlumnos(alumnos.map(alumno => 
      alumno.id === id ? { ...alumno, presente: !alumno.presente } : alumno
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!asignatura || !fecha) {
      setMensaje({ texto: 'Debe seleccionar asignatura y fecha.', tipo: 'error' });
      return;
    }

    // 3. Filtrar solo los que quedaron presentes para el reporte
    const presentes = alumnos.filter(a => a.presente).map(a => a.nombre);
    
    setMensaje({ 
      texto: `Asistencia guardada. Presentes: ${presentes.length} de ${alumnos.length}`, 
      tipo: 'exito' 
    });

    console.log("Reporte final:", {
      asignatura,
      fecha,
      listaDetallada: alumnos
    });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: 'auto', fontFamily: 'Arial' }}>
      <h2>Registro de Asistencia</h2>

      {mensaje.texto && (
        <div style={{
          padding: '10px', borderRadius: '5px', marginBottom: '15px',
          backgroundColor: mensaje.tipo === 'error' ? '#ffcccc' : '#ccffcc',
          color: mensaje.tipo === 'error' ? '#cc0000' : '#006600',
          border: '1px solid'
        }}>
          {mensaje.texto}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label>Asignatura:</label>
            <select value={asignatura} onChange={(e) => setAsignatura(e.target.value)} style={{ width: '100%', padding: '8px' }}>
              <option value="">-- Seleccione --</option>
              <option value="matematica">Matemática</option>
              <option value="programacion">Programación</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Fecha:</label>
            <input type="date" value={fecha} max={hoy} onChange={(e) => setFecha(e.target.value)} style={{ width: '100%', padding: '8px' }} />
          </div>
        </div>

        {/* 4. Tabla de Alumnos */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4', textAlign: 'left' }}>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Alumno</th>
              <th style={{ padding: '10px', borderBottom: '2px solid #ddd', textAlign: 'center' }}>¿Presente?</th>
            </tr>
          </thead>
          <tbody>
            {alumnos.map(alumno => (
              <tr key={alumno.id}>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{alumno.nombre}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={alumno.presente} 
                    onChange={() => toggleAsistencia(alumno.id)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" style={{
          width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white',
          border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'
        }}>
          Finalizar y Guardar Lista
        </button>
      </form>
    </div>
  );
};

export default AsistenciaPage;