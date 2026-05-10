# TODO - Libro virtual Colegio Bernardo O’Higgins

## Objetivo
Quitar “datos locales/hardcodeados” del profesor y conectar Asistencia/Calificaciones a Mongo vía microservicios.

## Pasos
1. [x] Extender modelo Mongo `Usuario` con `cursoId` como `int`.
2. [x] Actualizar `UsuarioRepository` con métodos para filtrar alumnos por curso (y por rol=alumno).
3. [x] Actualizar `UsuarioService` con método `listarAlumnosPorCurso(int cursoId)`.
4. [x] Extender `UsuarioController` con endpoint `GET /api/usuarios/alumnos?cursoId=...`.
5. [ ] Implementar seed automático en `ServicioUsuariosApplication` (o runner):
   - Usuarios profesor/alumno con `cursoId`.
6. [ ] Actualizar BFF para exponer endpoints necesarios (lista alumnos y persistencia asistencia/academico) y para login usando Mongo.
7. [ ] Actualizar frontend:
   - `AsistenciaPage.js`: reemplazar hardcode por `useEffect` + carga desde backend; guardar con POST real.
   - `CalificacionesPage.js`: reemplazar hardcode por carga real; guardar con POST real.
8. [ ] Levantar con Docker y validar flujo completo.




