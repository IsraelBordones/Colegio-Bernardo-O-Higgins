package cl.colegio.ohiggins.servicio_asistencia.service;

import cl.colegio.ohiggins.servicio_asistencia.model.Asistencia;
import cl.colegio.ohiggins.servicio_asistencia.repository.AsistenciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AsistenciaService {
    @Autowired
    private AsistenciaRepository repository;

    public List<Asistencia> historialAlumno(String alumnoId) {
        return repository.findByAlumnoId(alumnoId);
    }

    public Asistencia registrarAsistencia(Asistencia asistencia) {
        return repository.save(asistencia);
    }
}

