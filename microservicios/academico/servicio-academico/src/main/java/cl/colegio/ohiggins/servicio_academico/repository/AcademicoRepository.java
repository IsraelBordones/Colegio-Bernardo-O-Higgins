package cl.colegio.ohiggins.servicio_academico.repository;

import cl.colegio.ohiggins.servicio_academico.model.Academico;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcademicoRepository extends JpaRepository<Academico, Long> {

    List<Academico> findByAlumnoId(String alumnoId);
}

