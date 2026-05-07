package cl.colegio.ohiggins.asistencia.repository;

import cl.colegio.ohiggins.asistencia.model.Asistencia;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AsistenciaRepository extends MongoRepository<Asistencia, String> {
    List<Asistencia> findByAlumnoId(String alumnoId);
}