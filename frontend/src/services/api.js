import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/bff';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// AUTH
export const login = (username, password) =>
  api.post('/login', { username, password }).then(r => r.data);

// USUARIOS
export const listarUsuarios = () =>
  api.get('/usuarios').then(r => r.data);

export const listarAlumnosPorCurso = (cursoId) =>
  api.get(`/usuarios/alumnos?cursoId=${cursoId}`).then(r => r.data);

// NOTAS
export const listarNotas = (alumnoId) =>
  api.get(`/academico/alumno/${alumnoId}`).then(r => r.data);

export const guardarNota = (nota) =>
  api.post('/academico', nota).then(r => r.data);

// ASISTENCIA
export const historialAsistencia = (alumnoId) =>
  api.get(`/asistencia/alumno/${alumnoId}`).then(r => r.data);

export const registrarAsistencia = (asistencia) =>
  api.post('/asistencia', asistencia).then(r => r.data);

export default api;
