import React, { useState } from 'react';

const AsistenciaPage = () => {
  // Estado local con datos simulados (Mock)
  const [alumnos, setAlumnos] = useState([
    { id: 1, nombre: 'Juan Pérez', presente: false },
    { id: 2, nombre: 'María García', presente: false },
    { id: 3, nombre: 'Diego Soto', presente: false },
    { id: 4, nombre: 'Ana Morales', presente: false },
  ]);

  // Función para cambiar el estado (Check/Uncheck)
  const toggleAsistencia = (id) => {
    setAlumnos(alumnos.map(alumno => 
      alumno.id === id ? { ...alumno, presente: !alumno.presente } : alumno
    ));
  };

  const enviarAlBff = () => {
    const presentes = alumnos.filter(a => a.presente).length;
    alert(`Guardando asistencia: ${presentes} alumnos presentes de ${alumnos.length}.`);
    // Aquí irá el axios.post('http://localhost:8081/asistencia', alumnos);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Pasar Lista - 4to Medio B</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Alumno</th>
            <th style={{ padding: '10px', borderBottom: '2px solid #ddd' }}>Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map(alumno => (
            <tr key={alumno.id}>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{alumno.nombre}</td>
              <td style={{ padding: '10px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={alumno.presente} 
                  onChange={() => toggleAsistencia(alumno.id)}
                  style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button 
        onClick={enviarAlBff}
        style={{ 
          marginTop: '20px', 
          backgroundColor: '#28a745', 
          color: 'white', 
          padding: '12px 25px', 
          border: 'none', 
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Finalizar Registro de Hoy
      </button>
    </div>
  );
};

export default AsistenciaPage;