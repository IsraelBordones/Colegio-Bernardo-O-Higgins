import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mocks de páginas para aislar las pruebas de App
jest.mock('../pages/Login', () => ({ onLogin }) => (
  <div data-testid="login-page">
    <button onClick={() => onLogin({ username: 'test', rol: 'ALUMNO' })}>Login</button>
  </div>
));

jest.mock('../pages/DashboardAlumno', () => ({ usuario, onLogout }) => (
  <div data-testid="dashboard-alumno">Alumno: {usuario.username}</div>
));

jest.mock('../pages/DashboardProfesor', () => ({ usuario, onLogout }) => (
  <div data-testid="dashboard-profesor">Profesor: {usuario.username}</div>
));

describe('App - Enrutamiento por rol', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test('muestra Login cuando no hay sesión activa', () => {
    render(<App />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('muestra DashboardAlumno cuando el rol es ALUMNO', () => {
    sessionStorage.setItem('usuario', JSON.stringify({ username: 'juan', rol: 'ALUMNO' }));
    render(<App />);
    expect(screen.getByTestId('dashboard-alumno')).toBeInTheDocument();
  });

  test('muestra DashboardProfesor cuando el rol es PROFESOR', () => {
    sessionStorage.setItem('usuario', JSON.stringify({ username: 'profe', rol: 'PROFESOR' }));
    render(<App />);
    expect(screen.getByTestId('dashboard-profesor')).toBeInTheDocument();
  });

  test('muestra DashboardProfesor cuando el rol es TEACHER (alias)', () => {
    sessionStorage.setItem('usuario', JSON.stringify({ username: 'profe', role: 'TEACHER' }));
    render(<App />);
    expect(screen.getByTestId('dashboard-profesor')).toBeInTheDocument();
  });

  test('muestra DashboardAlumno por defecto si el rol es desconocido', () => {
    sessionStorage.setItem('usuario', JSON.stringify({ username: 'user', rol: 'OTRO' }));
    render(<App />);
    expect(screen.getByTestId('dashboard-alumno')).toBeInTheDocument();
  });
});
