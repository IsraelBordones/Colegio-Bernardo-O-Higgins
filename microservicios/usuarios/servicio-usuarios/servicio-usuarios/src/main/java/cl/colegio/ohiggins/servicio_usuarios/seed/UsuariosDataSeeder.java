package cl.colegio.ohiggins.servicio_usuarios.seed;

import org.springframework.context.annotation.Profile;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
@Profile("!test")
public class UsuariosDataSeeder {

    private final JdbcTemplate jdbcTemplate;

    public UsuariosDataSeeder(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void seedIfEmpty() {
        // Si ya hay datos, no re-insertamos (opción 1)
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM usuario", Integer.class);
        if (count != null && count > 0) {
            return;
        }

        try {
            // Ejecuta el script data.sql que ya existe en resources
            ClassPathResource resource = new ClassPathResource("data.sql");
            String sql = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);

            // Ejecutar statement-by-statement (data.sql tiene múltiples INSERT y comentarios)
            for (String statement : sql.split(";")) {
                String trimmed = statement.trim();
                if (trimmed.isEmpty()) {
                    continue;
                }
                jdbcTemplate.execute(trimmed);
            }

        } catch (IOException e) {
            throw new IllegalStateException("No se pudo leer data.sql para seed de usuarios", e);
        }
    }
}

