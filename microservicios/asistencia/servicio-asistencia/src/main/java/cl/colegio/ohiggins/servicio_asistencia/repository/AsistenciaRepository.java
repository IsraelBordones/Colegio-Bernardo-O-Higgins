package cl.colegio.ohiggins.servicio_asistencia.repository;

import cl.colegio.ohiggins.servicio_asistencia.model.Asistencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    List<Asistencia> findByAlumnoId(String alumnoId);
}

