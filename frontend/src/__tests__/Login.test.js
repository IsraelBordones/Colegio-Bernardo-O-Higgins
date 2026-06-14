import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../pages/Login';
import * as api from '../services/api';

// Mock del módulo api
jest.mock('../services/api');

describe('Login Component', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el formulario de login correctamente', () => {
    render(<Login onLogin={mockOnLogin} />);
    expect(screen.getByText(/Colegio Bernardo O'Higgins/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
  });

  test('muestra error cuando las credenciales son incorrectas', async () => {
    api.login.mockRejectedValueOnce(new Error('Unauthorized'));
    render(<Login onLogin={mockOnLogin} />);

    await userEvent.type(screen.getByLabelText(/usuario/i), 'usuario_invalido');
    await userEvent.type(screen.getByLabelText(/contraseña/i), 'clave_mala');
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument();
    });
    expect(mockOnLogin).not.toHaveBeenCalled();
  });

  test('llama a onLogin con los datos del usuario al hacer login exitoso', async () => {
    const usuarioMock = { username: 'juan', nombre: 'Juan Pérez', rol: 'ALUMNO' };
    api.login.mockResolvedValueOnce(usuarioMock);
    render(<Login onLogin={mockOnLogin} />);

    await userEvent.type(screen.getByLabelText(/usuario/i), 'juan');
    await userEvent.type(screen.getByLabelText(/contraseña/i), '1234');
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith(usuarioMock);
    });
  });

  test('deshabilita el botón mientras carga', async () => {
    api.login.mockImplementation(() => new Promise(() => {})); // nunca resuelve
    render(<Login onLogin={mockOnLogin} />);

    await userEvent.type(screen.getByLabelText(/usuario/i), 'juan');
    await userEvent.type(screen.getByLabelText(/contraseña/i), '1234');
    fireEvent.click(screen.getByRole('button', { name: /ingresar/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ingresando/i })).toBeDisabled();
    });
  });
});
