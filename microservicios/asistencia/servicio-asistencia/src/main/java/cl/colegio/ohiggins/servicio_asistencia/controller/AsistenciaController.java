package cl.colegio.ohiggins.servicio_asistencia.controller;

import cl.colegio.ohiggins.servicio_asistencia.model.Asistencia;
import cl.colegio.ohiggins.servicio_asistencia.service.AsistenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/asistencia")
public class AsistenciaController {
    @Autowired
    private AsistenciaService service;

    @PostMapping
    public Asistencia registrar(@RequestBody Asistencia asistencia) {
        return service.registrarAsistencia(asistencia);
    }

    @GetMapping("/alumno/{alumnoId}")
    public List<Asistencia> listarPorAlumno(@PathVariable String alumnoId) {
        return service.historialAlumno(alumnoId);
    }
}