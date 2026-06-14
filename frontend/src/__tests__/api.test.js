import axios from 'axios';
import { login, listarNotas, guardarNota, historialAsistencia, registrarAsistencia, listarUsuarios } from '../services/api';

jest.mock('axios');

// Recreamos la instancia mockeada
const mockAxiosInstance = {
  post: jest.fn(),
  get: jest.fn(),
};
axios.create.mockReturnValue(mockAxiosInstance);

// Re-importamos para usar la instancia mockeada
jest.resetModules();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxiosInstance.post.mockReset();
    mockAxiosInstance.get.mockReset();
  });

  test('login envía username y password correctamente', async () => {
    mockAxiosInstance.post.mockResolvedValueOnce({
      data: { username: 'juan', nombre: 'Juan', rol: 'ALUMNO' },
    });

    const result = await login('juan', '1234');
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/login', { username: 'juan', password: '1234' });
    expect(result).toEqual({ username: 'juan', nombre: 'Juan', rol: 'ALUMNO' });
  });

  test('listarNotas consulta el endpoint correcto', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: [{ id: 1, nota: 5.5 }] });
    const notas = await listarNotas('juan');
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/academico/alumno/juan');
    expect(notas).toHaveLength(1);
  });

  test('guardarNota envía el payload al endpoint correcto', async () => {
    const notaPayload = { alumnoId: 'juan', asignatura: 'Matemáticas', nota: 6.0 };
    mockAxiosInstance.post.mockResolvedValueOnce({ data: { ...notaPayload, id: 10 } });
    const result = await guardarNota(notaPayload);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/academico', notaPayload);
    expect(result.id).toBe(10);
  });

  test('historialAsistencia consulta el endpoint correcto', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: [{ id: 1, estado: 'PRESENTE' }] });
    const asistencia = await historialAsistencia('juan');
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/asistencia/alumno/juan');
    expect(asistencia[0].estado).toBe('PRESENTE');
  });

  test('registrarAsistencia envía correctamente', async () => {
    const payload = { alumnoId: 'juan', estado: 'PRESENTE', fecha: '2025-06-01' };
    mockAxiosInstance.post.mockResolvedValueOnce({ data: { ...payload, id: 5 } });
    const result = await registrarAsistencia(payload);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/asistencia', payload);
    expect(result.id).toBe(5);
  });

  test('listarUsuarios retorna la lista de usuarios', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: [{ username: 'a' }, { username: 'b' }] });
    const usuarios = await listarUsuarios();
    expect(usuarios).toHaveLength(2);
  });
});
