package cl.colegio.ohiggins.academico.service;

import cl.colegio.ohiggins.academico.model.Academico;
import cl.colegio.ohiggins.academico.repository.AcademicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AcademicoService {
    @Autowired
    private AcademicoRepository repository;

    public List<Academico> obtenerPorAlumno(String alumnoId) {
        return repository.findByAlumnoId(alumnoId);
    }

    public Academico guardarNota(Academico nota) {
        return repository.save(nota);
    }
}