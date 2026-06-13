import React, { useEffect, useMemo, useState } from 'react';
import { registrarAsistencia } from '../services/asistenciaService';
import { guardarCalificacion } from '../services/calificacionesService';
import { obtenerAlumnosPorCurso } from '../services/usuariosService';

const LibroClaseProfesor = () => {
  // ✅ useMemo estabiliza el objeto user para evitar bucle infinito
  const user = useMemo(() => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }, []);

  const [cursoId, setCursoId] = useState(1);
  const [asignatura, setAsignatura] = useState('Matemáticas');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const [alumnos, setAlumnos] = useState([]);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const [nota, setNota] = useState(4.0);
  const [periodo, setPeriodo] = useState(1);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const run = async () => {
      try {
        setError('');
        const data = await obtenerAlumnosPorCurso(cursoId);
        if (!cancelled) setAlumnos(data);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Error cargando alumnos');
      }
    };

    run();
    return () => { cancelled = true; };
  }, [cursoId]); // ✅ solo depende de cursoId, no del objeto user

  const marcar = async (alumno, estado) => {
    try {
      setLoading(true);
      setError('');
      setMensaje('');

      await registrarAsistencia({
        alumnoId: alumno.username,
        fecha,
        presente: estado === 'Presente',
        observaciones: '',
      });

      setMensaje(`✅ Asistencia guardada: ${alumno.nombre} - ${estado}`);
      setTimeout(() => setMensaje(''), 2500);
    } catch (e) {
      setError(e?.message || 'Error guardando asistencia');
    } finally {
      setLoading(false);
    }
  };

  const guardarNotaParaAlumno = async (alumno) => {
    try {
      setLoading(true);
      setError('');

      await guardarCalificacion({
        alumnoId: alumno.username,
        asignatura,
        calificacion: Number(nota),
        periodo: Number(periodo),
      });

      setMensaje(`⭐ Nota guardada: ${alumno.nombre}`);
      setTimeout(() => setMensaje(''), 2500);
    } catch (e) {
      setError(e?.message || 'Error guardando nota');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="container-card">Cargando...</div>;

  return (
    <div className="container-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>📘 Libro de Clases (Profesor)</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <select value={cursoId} onChange={(e) => setCursoId(Number(e.target.value))} style={{ padding: 8, borderRadius: 6 }}>
            <option value={1}>Curso 1</option>
            <option value={2}>Curso 2</option>
            <option value={3}>Curso 3</option>
          </select>
          <select value={asignatura} onChange={(e) => setAsignatura(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
            <option>Matemáticas</option>
            <option>Lenguaje</option>
            <option>Historia</option>
            <option>Ciencias</option>
          </select>
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} style={{ padding: 8, borderRadius: 6 }} />
        </div>
      </div>

      {mensaje && <div className="badge badge-presente" style={{ display: 'block', marginBottom: 20, padding: 15 }}>{mensaje}</div>}
      {error && <div className="badge badge-ausente" style={{ display: 'block', marginBottom: 20, padding: 15 }}>{error}</div>}

      <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontWeight: 600 }}>Nota:</label>
        <input type="number" step="0.1" value={nota} onChange={(e) => setNota(e.target.value)} style={{ width: 100, padding: 8, borderRadius: 6 }} />
        <label style={{ fontWeight: 600 }}>Periodo:</label>
        <input type="number" value={periodo} onChange={(e) => setPeriodo(e.target.value)} style={{ width: 90, padding: 8, borderRadius: 6 }} />
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Alumno</th>
            <th style={{ textAlign: 'center' }}>%</th>
            <th style={{ textAlign: 'center' }}>Asistencia</th>
            <th style={{ textAlign: 'center' }}>Guardar Nota</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>Sin alumnos para este curso</td>
            </tr>
          )}
          {alumnos.map((al) => (
            <tr key={al.id}>
              <td>{al.nombre}</td>
              <td style={{ textAlign: 'center' }}>—</td>
              <td style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                  <button
                    onClick={() => marcar(al, 'Presente')}
                    className="badge badge-presente"
                    style={{ cursor: 'pointer', border: 'none', width: 110 }}
                    disabled={loading}
                  >
                    Presente
                  </button>
                  <button
                    onClick={() => marcar(al, 'Ausente')}
                    className="badge badge-ausente"
                    style={{ cursor: 'pointer', border: 'none', width: 110 }}
                    disabled={loading}
                  >
                    Ausente
                  </button>
                </div>
              </td>
              <td style={{ textAlign: 'center' }}>
                <button className="btn-primary" onClick={() => guardarNotaParaAlumno(al)} disabled={loading}>
                  Guardar ⭐
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LibroClaseProfesor;