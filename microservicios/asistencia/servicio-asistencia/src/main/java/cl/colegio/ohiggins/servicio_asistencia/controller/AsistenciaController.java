package cl.colegio.ohiggins.servicio_asistencia.controller;

import cl.colegio.ohiggins.servicio_asistencia.model.Asistencia;
import cl.colegio.ohiggins.servicio_asistencia.service.AsistenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/asistencia")
public class AsistenciaController {
    @Autowired
    private AsistenciaService service;

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Asistencia asistencia) {
        if (asistencia.getAlumnoId() == null || asistencia.getAlumnoId().isBlank()) {
            return ResponseEntity.badRequest().body("alumnoId es obligatorio");
        }
        if (asistencia.getFecha() == null || asistencia.getFecha().isBlank()) {
            return ResponseEntity.badRequest().body("fecha es obligatoria");
        }
        if (asistencia.getEstado() == null || asistencia.getEstado().isBlank()) {
            asistencia.setEstado(asistencia.isPresente() ? "PRESENTE" : "AUSENTE");
        }
        Asistencia guardada = service.registrarAsistencia(asistencia);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    @GetMapping("/alumno/{alumnoId}")
    public ResponseEntity<List<Asistencia>> listarPorAlumno(@PathVariable String alumnoId) {
        return ResponseEntity.ok(service.historialAlumno(alumnoId));
    }
}
