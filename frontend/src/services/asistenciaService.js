const API_URL = "http://localhost:8080/api/bff";

export const registrarAsistencia = async ({ alumnoId, fecha, presente, observaciones }) => {
  const response = await fetch(`${API_URL}/asistencia`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ alumnoId, fecha, presente, observaciones }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al registrar asistencia');
  }

  return await response.json();
};

export const obtenerHistorialAsistenciaPorAlumno = async (alumnoId) => {
  const response = await fetch(`${API_URL}/asistencia/alumno/${encodeURIComponent(alumnoId)}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener historial de asistencia');
  }

  return await response.json();
};

