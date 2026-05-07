package cl.colegio.ohiggins.academico.repository;

import cl.colegio.ohiggins.academico.model.Academico;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AcademicoRepository extends MongoRepository<Academico, String> {
    // Buscar todas las notas de un alumno específico
    List<Academico> findByAlumnoId(String alumnoId);
}