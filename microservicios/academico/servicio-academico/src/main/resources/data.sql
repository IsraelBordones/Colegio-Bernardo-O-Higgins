-- Seed data para demo del "Libro de clases" (notas Chile)
-- Estructura: tabla Academico (id, alumnoId, asignatura, calificacion, periodo)

INSERT INTO academico (alumno_id, asignatura, calificacion, periodo) VALUES
  -- Alumno bueno (notas sobre 6.0)
  ('alumno_bueno', 'Matemáticas', 6.8, 1),
  ('alumno_bueno', 'Matemáticas', 6.5, 2),
  ('alumno_bueno', 'Lenguaje',   6.2, 1),
  ('alumno_bueno', 'Lenguaje',   6.6, 2),

  -- Alumno medio (notas alrededor de 5.0)
  ('alumno_medio', 'Matemáticas', 5.2, 1),
  ('alumno_medio', 'Matemáticas', 4.9, 2),
  ('alumno_medio', 'Lenguaje',   5.6, 1),
  ('alumno_medio', 'Lenguaje',   4.8, 2),

  -- Alumno malo (notas bajo 4.0)
  ('alumno_malo',  'Matemáticas', 3.6, 1),
  ('alumno_malo',  'Matemáticas', 3.9, 2),
  ('alumno_malo',  'Lenguaje',   4.0, 1),
  ('alumno_malo',  'Lenguaje',   3.7, 2);

