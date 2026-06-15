package cl.colegio.ohiggins.servicio_academico.controller;

import cl.colegio.ohiggins.servicio_academico.model.Academico;
import cl.colegio.ohiggins.servicio_academico.service.AcademicoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AcademicoController.class)
class AcademicoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AcademicoService service;

    @Autowired
    private ObjectMapper objectMapper;

    private Academico notaEjemplo;

    @BeforeEach
    void setUp() {
        notaEjemplo = new Academico();
        notaEjemplo.setId(1L);
        notaEjemplo.setAlumnoId("alumno_bueno");
        notaEjemplo.setAsignatura("Matemáticas");
        notaEjemplo.setCalificacion(6.5);
        notaEjemplo.setPeriodo(1);
        notaEjemplo.setTipo("Prueba");
    }

    @Test
    void GET_alumno_retornaListaDeNotas() throws Exception {
        when(service.obtenerPorAlumno("alumno_bueno"))
                .thenReturn(Arrays.asList(notaEjemplo));

        mockMvc.perform(get("/api/academico/alumno/alumno_bueno"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].asignatura").value("Matemáticas"))
                .andExpect(jsonPath("$[0].calificacion").value(6.5))
                .andExpect(jsonPath("$[0].alumnoId").value("alumno_bueno"));
    }

    @Test
    void GET_alumno_sinNotas_retornaListaVacia() throws Exception {
        when(service.obtenerPorAlumno("alumno_nuevo"))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/academico/alumno/alumno_nuevo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void POST_crearNota_retornaNotaGuardada() throws Exception {
        when(service.guardarNota(any(Academico.class))).thenReturn(notaEjemplo);

        mockMvc.perform(post("/api/academico")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(notaEjemplo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.asignatura").value("Matemáticas"))
                .andExpect(jsonPath("$.tipo").value("Prueba"));
    }

    @Test
    void GET_alumno_conVariasNotas_retornaTodasLasNotas() throws Exception {
        Academico nota2 = new Academico();
        nota2.setId(2L);
        nota2.setAlumnoId("alumno_bueno");
        nota2.setAsignatura("Lenguaje");
        nota2.setCalificacion(6.8);
        nota2.setPeriodo(2);
        nota2.setTipo("Control");

        when(service.obtenerPorAlumno("alumno_bueno"))
                .thenReturn(Arrays.asList(notaEjemplo, nota2));

        mockMvc.perform(get("/api/academico/alumno/alumno_bueno"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[1].asignatura").value("Lenguaje"));
    }

    @Test
    void POST_crearNota_calificacionReprobatoria_seGuardaCorrectamente() throws Exception {
        Academico notaMala = new Academico();
        notaMala.setId(3L);
        notaMala.setAlumnoId("alumno_malo");
        notaMala.setAsignatura("Historia");
        notaMala.setCalificacion(2.5);
        notaMala.setPeriodo(1);
        notaMala.setTipo("Examen");

        when(service.guardarNota(any(Academico.class))).thenReturn(notaMala);

        mockMvc.perform(post("/api/academico")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(notaMala)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.calificacion").value(2.5))
                .andExpect(jsonPath("$.alumnoId").value("alumno_malo"));
    }
}
