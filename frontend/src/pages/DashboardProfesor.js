import React, { useState, useEffect, useCallback } from 'react';
import {
  listarUsuarios,
  listarNotas,
  guardarNota,
  historialAsistencia,
  registrarAsistencia,
} from '../services/api';
import './Dashboard.css';
import './DashboardProfesor.css';

const ASIGNATURAS = [
  'Matemáticas',
  'Lenguaje',
  'Historia',
  'Ciencias',
  'Inglés',
  'Educación Física',
];

function DashboardProfesor({ usuario, onLogout }) {
  const [alumnos, setAlumnos] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [alumnoVista, setAlumnoVista] = useState(null);
  const [notas, setNotas] = useState([]);
  const [asistencia, setAsistencia] = useState([]);
  const [activeTab, setActiveTab] = useState('notas');
  const [loading, setLoading] = useState(true);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [showNota, setShowNota] = useState(false);
  const [showAsistencia, setShowAsistencia] = useState(false);

  const [nuevaNota, setNuevaNota] = useState({
    asignatura: ASIGNATURAS[0],
    tipo: 'Prueba',
    calificacion: '',
    periodo: 1,
  });

  const [nuevaAsistencia, setNuevaAsistencia] = useState({
    asignatura: ASIGNATURAS[0],
    fecha: new Date().toISOString().split('T')[0],
    estado: 'PRESENTE',
  });

  const [msg, setMsg] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const usuarios = await listarUsuarios();
        const soloAlumnos = (usuarios || []).filter(
          u => (u.role || u.rol || '').toUpperCase() === 'ALUMNO' ||
               (u.role || u.rol || '').toUpperCase() === 'STUDENT'
        );
        const lista = soloAlumnos.length > 0 ? soloAlumnos : (usuarios || []).filter(
          u => (u.role || u.rol || '').toUpperCase() !== 'PROFESOR' &&
               (u.role || u.rol || '').toUpperCase() !== 'TEACHER'
        );
        setAlumnos(lista);
      } catch (e) {
        console.error('Error cargando usuarios:', e);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const seleccionarAlumno = useCallback(async (alumno) => {
    if (loadingDetalle) return;
    setLoadingDetalle(true);
    setAlumnoSeleccionado(alumno);
    setAlumnoVista(null);
    setNotas([]);
    setAsistencia([]);
    setShowNota(false);
    setShowAsistencia(false);
    setMsg('');
    try {
      const [notasData, asistenciaData] = await Promise.all([
        listarNotas(alumno.username),
        historialAsistencia(alumno.username),
      ]);
      setNotas(notasData || []);
      setAsistencia(asistenciaData || []);
      setAlumnoVista(alumno);
    } catch (e) {
      console.error('Error cargando detalle alumno:', e);
      setNotas([]);
      setAsistencia([]);
      setAlumnoVista(alumno);
    } finally {
      setLoadingDetalle(false);
    }
  }, [loadingDetalle]);

  const handleGuardarNota = async (e) => {
    e.preventDefault();
    if (!alumnoVista) return;
    const notaNum = parseFloat(nuevaNota.calificacion);
    if (isNaN(notaNum) || notaNum < 1.0 || notaNum > 7.0) {
      setMsg('La nota debe estar entre 1.0 y 7.0');
      return;
    }
    try {
      const payload = {
        alumnoId: alumnoVista.username,
        asignatura: nuevaNota.asignatura,
        tipo: nuevaNota.tipo,
        calificacion: notaNum,
        periodo: nuevaNota.periodo,
      };
      await guardarNota(payload);
      setMsg('✅ Nota guardada correctamente');
      setShowNota(false);
      setNuevaNota({ asignatura: ASIGNATURAS[0], tipo: 'Prueba', calificacion: '', periodo: 1 });
      const nuevasNotas = await listarNotas(alumnoVista.username);
      setNotas(nuevasNotas || []);
    } catch (e) {
      setMsg('❌ Error al guardar la nota. Intente nuevamente.');
    }
  };

  const handleRegistrarAsistencia = async (e) => {
    e.preventDefault();
    if (!alumnoVista) return;
    try {
      const payload = {
        alumnoId: alumnoVista.username,
        asignatura: nuevaAsistencia.asignatura,
        fecha: nuevaAsistencia.fecha,
        presente: nuevaAsistencia.estado === 'PRESENTE',
        estado: nuevaAsistencia.estado,
      };
      await registrarAsistencia(payload);
      setMsg('✅ Asistencia registrada correctamente');
      setShowAsistencia(false);
      setNuevaAsistencia({ asignatura: ASIGNATURAS[0], fecha: new Date().toISOString().split('T')[0], estado: 'PRESENTE' });
      const nueva = await historialAsistencia(alumnoVista.username);
      setAsistencia(nueva || []);
    } catch (e) {
      setMsg('❌ Error al registrar asistencia. Intente nuevamente.');
    }
  };

  const promedio = notas.length
    ? (notas.reduce((acc, n) => acc + (parseFloat(n.calificacion) || 0), 0) / notas.length).toFixed(1)
    : '-';

  const presentes = asistencia.filter(a => a.presente || a.estado === 'PRESENTE').length;
  const pctAsistencia = asistencia.length ? Math.round((presentes / asistencia.length) * 100) : 0;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-brand">
          <h1>Colegio Bernardo O'Higgins</h1>
        </div>
        <div className="header-user">
          <span>Prof. <strong>{usuario.nombre || usuario.username}</strong></span>
          <span className="badge badge-profesor">Profesor</span>
          <button className="btn-logout" onClick={onLogout}>Cerrar sesión</button>
        </div>
      </header>

      <div className="profesor-layout">
        <aside className="alumnos-panel">
          <h2 className="panel-title">Mis Alumnos</h2>
          {loading ? (
            <p className="loading">Cargando...</p>
          ) : alumnos.length === 0 ? (
            <p className="empty-msg">No hay alumnos registrados.</p>
          ) : (
            <ul className="alumnos-list">
              {alumnos.map((a, i) => (
                <li
                  key={a.id || a.username || i}
                  className={`alumno-item ${alumnoSeleccionado?.username === a.username ? 'selected' : ''}`}
                  onClick={() => seleccionarAlumno(a)}
                >
                  <div className="alumno-avatar">{(a.nombre || a.username || '?')[0].toUpperCase()}</div>
                  <div>
                    <div className="alumno-nombre">{a.nombre || a.username}</div>
                    <div className="alumno-sub">@{a.username}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <main className="detalle-panel">
          {!alumnoSeleccionado ? (
            <div className="no-selection">
              <p>← Selecciona un alumno para ver su información</p>
            </div>
          ) : loadingDetalle ? (
            <div className="no-selection">
              <p>Cargando información del alumno...</p>
            </div>
          ) : !alumnoVista ? (
            <div className="no-selection">
              <p>← Selecciona un alumno para ver su información</p>
            </div>
          ) : (
            <>
              <div className="detalle-header">
                <h2>{alumnoVista.nombre || alumnoVista.username}</h2>
                <span className="alumno-sub">@{alumnoVista.username}</span>
              </div>

              {msg && (
                <div className={`msg-banner ${msg.startsWith('✅') ? 'success' : 'error'}`}>
                  {msg}
                  <button className="msg-close" onClick={() => setMsg('')}>×</button>
                </div>
              )}

              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-value">{promedio}</div>
                  <div className="stat-label">Promedio</div>
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
                  Notas
                </button>
                <button
                  className={`tab-btn ${activeTab === 'asistencia' ? 'active' : ''}`}
                  onClick={() => setActiveTab('asistencia')}
                >
                  Asistencia
                </button>
              </div>

              {activeTab === 'notas' && (
                <div className="tab-content">
                  <div className="tab-actions">
                    <button className="btn-primary" onClick={() => { setShowNota(!showNota); setMsg(''); }}>
                      {showNota ? 'Cancelar' : '+ Agregar Nota'}
                    </button>
                  </div>

                  {showNota && (
                    <form className="form-card" onSubmit={handleGuardarNota}>
                      <h3>Nueva Nota</h3>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Asignatura</label>
                          <select
                            value={nuevaNota.asignatura}
                            onChange={e => setNuevaNota({ ...nuevaNota, asignatura: e.target.value })}
                          >
                            {ASIGNATURAS.map(a => (
                              <option key={a} value={a}>{a}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Tipo</label>
                          <select
                            value={nuevaNota.tipo}
                            onChange={e => setNuevaNota({ ...nuevaNota, tipo: e.target.value })}
                          >
                            <option>Prueba</option>
                            <option>Tarea</option>
                            <option>Control</option>
                            <option>Examen</option>
                            <option>Trabajo</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Nota (1.0 – 7.0)</label>
                          <input
                            type="number"
                            step="0.1"
                            min="1.0"
                            max="7.0"
                            value={nuevaNota.calificacion}
                            onChange={e => setNuevaNota({ ...nuevaNota, calificacion: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Período</label>
                          <select
                            value={nuevaNota.periodo}
                            onChange={e => setNuevaNota({ ...nuevaNota, periodo: parseInt(e.target.value) })}
                          >
                            <option value={1}>Período 1</option>
                            <option value={2}>Período 2</option>
                            <option value={3}>Período 3</option>
                            <option value={4}>Período 4</option>
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="btn-primary">Guardar Nota</button>
                    </form>
                  )}

                  <div className="table-wrapper">
                    {notas.length === 0 ? (
                      <p className="empty-msg">Este alumno no tiene notas registradas.</p>
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
                              <td>{n.asignatura || '-'}</td>
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
                </div>
              )}

              {activeTab === 'asistencia' && (
                <div className="tab-content">
                  <div className="tab-actions">
                    <button className="btn-primary" onClick={() => { setShowAsistencia(!showAsistencia); setMsg(''); }}>
                      {showAsistencia ? 'Cancelar' : '+ Registrar Asistencia'}
                    </button>
                  </div>

                  {showAsistencia && (
                    <form className="form-card" onSubmit={handleRegistrarAsistencia}>
                      <h3>Registrar Asistencia</h3>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Asignatura</label>
                          <select
                            value={nuevaAsistencia.asignatura}
                            onChange={e => setNuevaAsistencia({ ...nuevaAsistencia, asignatura: e.target.value })}
                          >
                            {ASIGNATURAS.map(a => (
                              <option key={a} value={a}>{a}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Fecha</label>
                          <input
                            type="date"
                            value={nuevaAsistencia.fecha}
                            onChange={e => setNuevaAsistencia({ ...nuevaAsistencia, fecha: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Estado</label>
                        <select
                          value={nuevaAsistencia.estado}
                          onChange={e => setNuevaAsistencia({ ...nuevaAsistencia, estado: e.target.value })}
                        >
                          <option value="PRESENTE">Presente</option>
                          <option value="AUSENTE">Ausente</option>
                          <option value="JUSTIFICADO">Justificado</option>
                        </select>
                      </div>
                      <button type="submit" className="btn-primary">Registrar</button>
                    </form>
                  )}

                  <div className="table-wrapper">
                    {asistencia.length === 0 ? (
                      <p className="empty-msg">No hay registros de asistencia.</p>
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
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default DashboardProfesor;