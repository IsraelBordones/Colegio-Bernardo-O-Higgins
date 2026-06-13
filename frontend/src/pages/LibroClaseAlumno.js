import React, { useEffect, useMemo, useState } from 'react';
import { obtenerCalificacionesPorAlumno } from '../services/calificacionesService';
import { obtenerHistorialAsistenciaPorAlumno } from '../services/asistenciaService';

const LibroClaseAlumno = () => {
  // ✅ useMemo estabiliza el objeto user: solo se parsea una vez,
  //    no en cada render, evitando el bucle infinito del useEffect.
  const user = useMemo(() => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }, []);

  const alumnoId = useMemo(() => user?.username || user?.id || '', [user]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [calificaciones, setCalificaciones] = useState([]);
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    if (!alumnoId) return;

    let cancelled = false; // evita actualizar estado si el componente se desmonta

    const run = async () => {
      try {
        setLoading(true);
        setError('');
        const [cal, asis] = await Promise.all([
          obtenerCalificacionesPorAlumno(alumnoId),
          obtenerHistorialAsistenciaPorAlumno(alumnoId).catch(() => []), // asistencia puede fallar sin romper todo
        ]);
        if (!cancelled) {
          setCalificaciones(cal);
          setAsistencias(asis);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Error cargando datos');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [alumnoId]); // ✅ solo depende de alumnoId (string estable), no del objeto user

  const resumen = useMemo(() => {
    const porAsignatura = {};
    for (const item of calificaciones || []) {
      const asignatura = item.asignatura || 'Sin asignatura';
      if (!porAsignatura[asignatura]) porAsignatura[asignatura] = [];
      porAsignatura[asignatura].push(item.calificacion);
    }

    const calByAsignatura = Object.entries(porAsignatura).map(([asignatura, notas]) => {
      const promedio = notas.length
        ? (notas.reduce((a, b) => a + (b || 0), 0) / notas.length).toFixed(1)
        : '0.0';
      return { asignatura, notas, promedio: Number(promedio) };
    });

    const total = (asistencias || []).length;
    const presentes = (asistencias || []).filter(a => a.presente === true).length;
    const asistenciaTotal = total ? Math.round((presentes / total) * 100) : 0;

    const promedioNotas = calByAsignatura.length
      ? Number((calByAsignatura.reduce((acc, x) => acc + (Number(x.promedio) || 0), 0) / calByAsignatura.length).toFixed(1))
      : 0;

    const promovido = promedioNotas >= 4;

    return { calByAsignatura, asistenciaTotal, promedioNotas, promovido };
  }, [calificaciones, asistencias]);

  if (!user) return <div className="container-card">Cargando...</div>;

  return (
    <div className="container-card">
      <div style={{ borderBottom: '2px solid #eee', marginBottom: '30px', paddingBottom: '10px' }}>
        <h1>📚 Libro de Clases (Alumno)</h1>
        <p>
          Bienvenido, <strong>{user.nombre}</strong> | RUN: {user.username}
        </p>
      </div>

      {loading && <div className="badge badge-presente" style={{ display: 'block', marginBottom: 20 }}>Cargando...</div>}
      {error && <div className="badge badge-ausente" style={{ display: 'block', marginBottom: 20 }}>{error}</div>}

      {!loading && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>Promedio General</span>
              <span style={styles.statValue}>{resumen.promedioNotas}</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>Asistencia Total</span>
              <span style={styles.statValue}>{resumen.asistenciaTotal}%</span>
            </div>
            <div style={styles.statBox}>
              <span style={styles.statLabel}>Situación Final</span>
              <span className={`badge ${resumen.promovido ? 'badge-presente' : 'badge-ausente'}`}>
                {resumen.promovido ? 'Promovido' : 'En proceso'}
              </span>
            </div>
          </div>

          <h3>📊 Resumen por Asignatura</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Asignatura</th>
                <th>Calificaciones</th>
                <th style={{ textAlign: 'center' }}>Promedio</th>
              </tr>
            </thead>
            <tbody>
              {resumen.calByAsignatura.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center' }}>Sin datos</td>
                </tr>
              )}
              {resumen.calByAsignatura.map(r => (
                <tr key={r.asignatura}>
                  <td style={{ fontWeight: 500 }}>{r.asignatura}</td>
                  <td>{r.notas?.length ? r.notas.join(' - ') : '-'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <strong style={{ color: r.promedio >= 4 ? '#27ae60' : '#e74c3c' }}>{r.promedio}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
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
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.02)',
  },
  statLabel: { fontSize: '0.9rem', color: '#666', marginBottom: '5px' },
  statValue: { fontSize: '1.8rem', fontWeight: 'bold', color: '#2c3e50' },
};

export default LibroClaseAlumno;