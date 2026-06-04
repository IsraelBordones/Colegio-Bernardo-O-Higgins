-- Seed data for initial demo
-- Usuario table is created automatically via hibernate (ddl-auto=update)

INSERT INTO usuario (curso_id, nombre, password, role, username) VALUES
  (1, 'Alumno Bueno', '1234', 'alumno', 'alumno_bueno'),
  (1, 'Alumno Medio', '1234', 'alumno', 'alumno_medio'),
  (1, 'Alumno Malo',  '1234', 'alumno', 'alumno_malo');

