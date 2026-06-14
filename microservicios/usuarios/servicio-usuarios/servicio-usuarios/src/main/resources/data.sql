INSERT INTO usuario (curso_id, nombre, password, role, username) VALUES
  (1, 'Alumno Bueno', '1234', 'alumno', 'alumno_bueno'),
  (1, 'Alumno Medio', '1234', 'alumno', 'alumno_medio'),
  (1, 'Alumno Malo',  '1234', 'alumno', 'alumno_malo'),
  (1, 'Andres Gonzalez', 'profesor123', 'PROFESOR', 'profe1')
ON DUPLICATE KEY UPDATE role=VALUES(role);
