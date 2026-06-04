const API_URL = "http://localhost:8080/api/bff";

export const obtenerAlumnosPorCurso = async (cursoId) => {
  const response = await fetch(`${API_URL}/usuarios/alumnos?cursoId=${encodeURIComponent(cursoId)}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener alumnos');
  }

  return await response.json();
};

