package cl.colegio.ohiggins.academico.controller;

import cl.colegio.ohiggins.academico.model.Academico;
import cl.colegio.ohiggins.academico.service.AcademicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/academico")
public class AcademicoController {
    @Autowired
    private AcademicoService service;

    @PostMapping
    public Academico crear(@RequestBody Academico nota) {
        return service.guardarNota(nota);
    }

    @GetMapping("/alumno/{alumnoId}")
    public List<Academico> listarPorAlumno(@PathVariable String alumnoId) {
        return service.obtenerPorAlumno(alumnoId);
    }
}