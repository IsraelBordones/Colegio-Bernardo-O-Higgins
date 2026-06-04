-- Seed data para demo del "Libro de clases" (asistencia)
-- Estructura: tabla Asistencia (id, alumnoId, fecha, presente, observaciones)

INSERT INTO asistencia (alumno_id, fecha, presente, observaciones) VALUES
  -- Alumno bueno: alta asistencia (6/6 presente)
  ('alumno_bueno', '2026-04-01', true,  ''),
  ('alumno_bueno', '2026-04-02', true,  ''),
  ('alumno_bueno', '2026-04-03', true,  ''),
  ('alumno_bueno', '2026-04-04', true,  ''),
  ('alumno_bueno', '2026-04-05', true,  ''),
  ('alumno_bueno', '2026-04-06', true,  ''),

  -- Alumno medio: asistencia intermedia (4/6 presente)
  ('alumno_medio', '2026-04-01', true,  ''),
  ('alumno_medio', '2026-04-02', false, ''),
  ('alumno_medio', '2026-04-03', true,  ''),
  ('alumno_medio', '2026-04-04', true,  ''),
  ('alumno_medio', '2026-04-05', false, ''),
  ('alumno_medio', '2026-04-06', true,  ''),

  -- Alumno malo: baja asistencia (2/6 presente)
  ('alumno_malo', '2026-04-01', false, ''),
  ('alumno_malo', '2026-04-02', true,  ''),
  ('alumno_malo', '2026-04-03', false, ''),
  ('alumno_malo', '2026-04-04', false, ''),
  ('alumno_malo', '2026-04-05', true,  ''),
  ('alumno_malo', '2026-04-06', false, '');

