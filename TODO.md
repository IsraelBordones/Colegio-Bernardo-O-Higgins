# TODO - Cambio MongoDB -> MySQL (Completado)

## Estado
- [x] Se parametrizó `docker-compose.yml` para levantar MySQL.
- [x] Se ajustaron `application.properties` de los microservicios para usar `spring.datasource.*` (JDBC) y `spring.jpa.hibernate.ddl-auto`.
- [x] Se migraron modelos y repositorios a JPA:
  - [x] `Usuario` -> `@Entity` con `@Id Long`
  - [x] `UsuarioRepository` -> `JpaRepository`
  - [x] `Asistencia` -> `@Entity` con `@Id Long`
  - [x] `AsistenciaRepository` -> `JpaRepository`
  - [x] `Academico` -> `@Entity` con `@Id Long`
  - [x] `AcademicoRepository` -> `JpaRepository`

## Pendientes (si quieres consolidar aún más)
1. [ ] Revisar el BFF (`/api/bff/login`) para que consulte usuarios reales (ahora está hardcodeado).
2. [ ] Opcional: agregar validaciones/constraints SQL (unique en username).
3. [ ] Asegurar que el frontend persista asistencia y notas vía BFF (ahora usa datos hardcodeados).

