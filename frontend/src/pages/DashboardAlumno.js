import React, { useState, useEffect } from 'react';
import { listarNotas, historialAsistencia } from '../services/api';
import './Dashboard.css';

function DashboardAlumno({ usuario, onLogout }) {
  const [notas, setNotas] = useState([]);
  const [asistencia, setAsistencia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notas');
  const [asignaturaAbierta, setAsignaturaAbierta] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [notasData, asistenciaData] = await Promise.all([
          listarNotas(usuario.username),
          historialAsistencia(usuario.username),
        ]);
        setNotas(notasData || []);
        setAsistencia(asistenciaData || []);
      } catch (e) {
        console.error('Error cargando datos:', e);
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, [usuario.username]);

  const promedio = notas.length
    ? (notas.reduce((acc, n) => acc + (parseFloat(n.calificacion) || 0), 0) / notas.length).toFixed(1)
    : '-';

  const presentes = asistencia.filter(a => a.presente || a.estado === 'PRESENTE').length;
  const pctAsistencia = asistencia.length
    ? Math.round((presentes / asistencia.length) * 100)
    : 0;

  const notasPorAsignatura = notas.reduce((acc, n) => {
    const key = n.asignatura || 'Sin asignatura';
    if (!acc[key]) acc[key] = [];
    acc[key].push(n);
    return acc;
  }, {});

  const asistenciaPorAsignatura = asistencia.reduce((acc, a) => {
    const key = a.asignatura || 'Sin asignatura';
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  const toggleAsignatura = (nombre) => {
    setAsignaturaAbierta(prev => prev === nombre ? null : nombre);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-brand">
          <h1>Colegio Bernardo O'Higgins</h1>
        </div>
        <div className="header-user">
          <span>Bienvenido/a, <strong>{usuario.nombre || usuario.username}</strong></span>
          <span className="badge badge-alumno">Alumno</span>
          <button className="btn-logout" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{promedio}</div>
            <div className="stat-label">Promedio General</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{notas.length}</div>
            <div className="stat-label">Evaluaciones</div>
          </div>
          <div className="stat-card">
            <div className={`stat-value ${pctAsistencia < 75 ? 'text-danger' : 'text-success'}`}>
              {pctAsistencia}%
            </div>
            <div className="stat-label">Asistencia</div>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'notas' ? 'active' : ''}`}
            onClick={() => { setActiveTab('notas'); setAsignaturaAbierta(null); }}
          >
            Mis Notas
          </button>
          <button
            className={`tab-btn ${activeTab === 'asistencia' ? 'active' : ''}`}
            onClick={() => { setActiveTab('asistencia'); setAsignaturaAbierta(null); }}
          >
            Mi Asistencia
          </button>
        </div>

        {loading ? (
          <div className="loading">Cargando datos...</div>
        ) : activeTab === 'notas' ? (
          <div>
            {notas.length === 0 ? (
              <p className="empty-msg">No hay notas registradas aún.</p>
            ) : (
              Object.entries(notasPorAsignatura).map(([asignatura, notasAsig]) => {
                const promedioAsig = (
                  notasAsig.reduce((acc, n) => acc + (parseFloat(n.calificacion) || 0), 0) /
                  notasAsig.length
                ).toFixed(1);
                const aprobada = parseFloat(promedioAsig) >= 4.0;
                const abierta = asignaturaAbierta === asignatura;
                return (
                  <div key={asignatura} className="asignatura-card">
                    <div
                      className="asignatura-header clickable"
                      onClick={() => toggleAsignatura(asignatura)}
                    >
                      <div className="asignatura-header-left">
                        <span className="asignatura-chevron">{abierta ? '▼' : '▶'}</span>
                        <span className="asignatura-nombre">{asignatura}</span>
                        <span className="asignatura-count">{notasAsig.length} evaluación{notasAsig.length !== 1 ? 'es' : ''}</span>
                      </div>
                      <span className={`promedio-badge ${aprobada ? 'aprobado' : 'reprobado'}`}>
                        Promedio {promedioAsig}
                      </span>
                    </div>
                    {abierta && (
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Tipo</th>
                            <th>Nota</th>
                            <th>Período</th>
                          </tr>
                        </thead>
                        <tbody>
                          {notasAsig.map((n, i) => (
                            <tr key={n.id || i}>
                              <td>{n.tipo || '-'}</td>
                              <td>
                                <span className={`nota-badge ${parseFloat(n.calificacion) >= 4.0 ? 'aprobado' : 'reprobado'}`}>
                                  {n.calificacion}
                                </span>
                              </td>
                              <td>{n.periodo ? `Período ${n.periodo}` : '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div>
            {asistencia.length === 0 ? (
              <p className="empty-msg">No hay registros de asistencia aún.</p>
            ) : (
              Object.entries(asistenciaPorAsignatura).map(([asignatura, registros]) => {
                const presentesAsig = registros.filter(a => a.presente || a.estado === 'PRESENTE').length;
                const pctAsig = Math.round((presentesAsig / registros.length) * 100);
                const okAsig = pctAsig >= 75;
                const abierta = asignaturaAbierta === asignatura;
                return (
                  <div key={asignatura} className="asignatura-card">
                    <div
                      className="asignatura-header clickable"
                      onClick={() => toggleAsignatura(asignatura)}
                    >
                      <div className="asignatura-header-left">
                        <span className="asignatura-chevron">{abierta ? '▼' : '▶'}</span>
                        <span className="asignatura-nombre">{asignatura}</span>
                        <span className="asignatura-count">{registros.length} registro{registros.length !== 1 ? 's' : ''}</span>
                      </div>
                      <span className={`promedio-badge ${okAsig ? 'aprobado' : 'reprobado'}`}>
                        Asistencia {pctAsig}%
                      </span>
                    </div>
                    {abierta && (
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Fecha</th>
                            <th>Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registros.map((a, i) => (
                            <tr key={a.id || i}>
                              <td>{a.fecha ? new Date(a.fecha).toLocaleDateString('es-CL') : '-'}</td>
                              <td>
                                <span className={`asistencia-badge ${(a.presente || a.estado === 'PRESENTE') ? 'presente' : a.estado === 'JUSTIFICADO' ? 'justificado' : 'ausente'}`}>
                                  {a.estado || (a.presente ? 'Presente' : 'Ausente')}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardAlumno;