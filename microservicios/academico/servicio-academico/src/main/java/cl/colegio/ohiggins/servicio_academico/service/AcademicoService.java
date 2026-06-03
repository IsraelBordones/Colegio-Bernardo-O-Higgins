package cl.colegio.ohiggins.servicio_academico.service;

import cl.colegio.ohiggins.servicio_academico.model.Academico;
import cl.colegio.ohiggins.servicio_academico.repository.AcademicoRepository;


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

