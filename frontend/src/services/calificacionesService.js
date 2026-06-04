const API_URL = "http://localhost:8080/api/bff";

export const obtenerCalificacionesPorAlumno = async (alumnoId) => {
  const response = await fetch(`${API_URL}/academico/alumno/${encodeURIComponent(alumnoId)}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener calificaciones');
  }

  return await response.json();
};

export const guardarCalificacion = async ({ alumnoId, asignatura, calificacion, periodo }) => {
  const response = await fetch(`${API_URL}/academico`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alumnoId, asignatura, calificacion, periodo }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al guardar calificación');
  }

  return await response.json();
};

