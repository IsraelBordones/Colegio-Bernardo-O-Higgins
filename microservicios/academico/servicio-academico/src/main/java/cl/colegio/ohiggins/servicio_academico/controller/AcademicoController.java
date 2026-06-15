package cl.colegio.ohiggins.servicio_academico.controller;

import cl.colegio.ohiggins.servicio_academico.model.Academico;
import cl.colegio.ohiggins.servicio_academico.service.AcademicoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/academico")
public class AcademicoController {
    @Autowired
    private AcademicoService service;

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Academico nota) {
        if (nota.getAlumnoId() == null || nota.getAlumnoId().isBlank()) {
            return ResponseEntity.badRequest().body("alumnoId es obligatorio");
        }
        if (nota.getCalificacion() == null) {
            return ResponseEntity.badRequest().body("calificacion es obligatoria");
        }
        if (nota.getCalificacion() < 1.0 || nota.getCalificacion() > 7.0) {
            return ResponseEntity.badRequest().body("calificacion debe estar entre 1.0 y 7.0");
        }
        Academico guardada = service.guardarNota(nota);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    @GetMapping("/alumno/{alumnoId}")
    public ResponseEntity<List<Academico>> listarPorAlumno(@PathVariable String alumnoId) {
        return ResponseEntity.ok(service.obtenerPorAlumno(alumnoId));
    }
}
