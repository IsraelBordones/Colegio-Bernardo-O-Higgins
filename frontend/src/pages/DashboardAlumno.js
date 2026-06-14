import React, { useState, useEffect } from 'react';
import { listarNotas, historialAsistencia } from '../services/api';
import './Dashboard.css';

function DashboardAlumno({ usuario, onLogout }) {
  const [notas, setNotas] = useState([]);
  const [asistencia, setAsistencia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notas');

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
            onClick={() => setActiveTab('notas')}
          >
            Mis Notas
          </button>
          <button
            className={`tab-btn ${activeTab === 'asistencia' ? 'active' : ''}`}
            onClick={() => setActiveTab('asistencia')}
          >
            Mi Asistencia
          </button>
        </div>

        {loading ? (
          <div className="loading">Cargando datos...</div>
        ) : activeTab === 'notas' ? (
          <div className="table-wrapper">
            {notas.length === 0 ? (
              <p className="empty-msg">No hay notas registradas aún.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Asignatura</th>
                    <th>Tipo</th>
                    <th>Nota</th>
                    <th>Período</th>
                  </tr>
                </thead>
                <tbody>
                  {notas.map((n, i) => (
                    <tr key={n.id || i}>
                      <td>{i + 1}</td>
                      <td>{n.asignatura || n.materia || '-'}</td>
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
        ) : (
          <div className="table-wrapper">
            {asistencia.length === 0 ? (
              <p className="empty-msg">No hay registros de asistencia aún.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Asignatura</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {asistencia.map((a, i) => (
                    <tr key={a.id || i}>
                      <td>{i + 1}</td>
                      <td>{a.fecha ? new Date(a.fecha).toLocaleDateString('es-CL') : '-'}</td>
                      <td>{a.asignatura || '-'}</td>
                      <td>
                        <span className={`asistencia-badge ${(a.presente || a.estado === 'PRESENTE') ? 'presente' : 'ausente'}`}>
                          {(a.presente || a.estado === 'PRESENTE') ? 'Presente' : 'Ausente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardAlumno;