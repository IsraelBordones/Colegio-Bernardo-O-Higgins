package cl.colegio.ohiggins.servicio_asistencia.seed;

import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class AsistenciaDataSeeder {

    private final JdbcTemplate jdbcTemplate;

    public AsistenciaDataSeeder(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostConstruct
    public void seedIfEmpty() {
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM asistencia", Integer.class);
        if (count != null && count > 0) {
            return;
        }

        try {
            ClassPathResource resource = new ClassPathResource("data.sql");
            String sql = new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            for (String statement : sql.split(";")) {
                String trimmed = statement.trim();
                if (trimmed.isEmpty()) {
                    continue;
                }
                jdbcTemplate.execute(trimmed);
            }

        } catch (IOException e) {
            throw new IllegalStateException("No se pudo leer data.sql para seed de asistencia", e);
        }
    }
}

