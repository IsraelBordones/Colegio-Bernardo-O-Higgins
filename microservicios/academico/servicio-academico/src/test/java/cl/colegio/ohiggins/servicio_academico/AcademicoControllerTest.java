package cl.colegio.ohiggins.servicio_academico;

import cl.colegio.ohiggins.servicio_academico.controller.AcademicoController;
import cl.colegio.ohiggins.servicio_academico.model.Academico;
import cl.colegio.ohiggins.servicio_academico.service.AcademicoService;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
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

    @MockitoBean
    private AcademicoService service;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private Academico nota;

    @BeforeEach
    void setUp() {
        nota = new Academico();
        nota.setAlumnoId("alumno_01");
        nota.setAsignatura("Matemáticas");
        nota.setCalificacion(6.5);
        nota.setPeriodo(1);
        nota.setTipo("Control");
    }

    // =========================================================
    // GET /api/academico/alumno/{alumnoId}
    // =========================================================

    @Test
    void GET_notasPorAlumno_retornaLista() throws Exception {
        when(service.obtenerPorAlumno("alumno_01")).thenReturn(Arrays.asList(nota));

        mockMvc.perform(get("/api/academico/alumno/alumno_01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].alumnoId").value("alumno_01"))
                .andExpect(jsonPath("$[0].asignatura").value("Matemáticas"))
                .andExpect(jsonPath("$[0].calificacion").value(6.5));
    }

    @Test
    void GET_notasPorAlumno_listaVacia_retornaArregloVacio() throws Exception {
        when(service.obtenerPorAlumno("alumno_99")).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/academico/alumno/alumno_99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void GET_notasPorAlumno_multipleNotas_retornaTodasLasNotas() throws Exception {
        Academico nota2 = new Academico();
        nota2.setAlumnoId("alumno_01");
        nota2.setAsignatura("Historia");
        nota2.setCalificacion(5.5);
        when(service.obtenerPorAlumno("alumno_01")).thenReturn(Arrays.asList(nota, nota2));

        mockMvc.perform(get("/api/academico/alumno/alumno_01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[1].asignatura").value("Historia"));
    }

    @Test
    void GET_notasPorAlumno_verificaPeriodoYTipo() throws Exception {
        when(service.obtenerPorAlumno("alumno_01")).thenReturn(Arrays.asList(nota));

        mockMvc.perform(get("/api/academico/alumno/alumno_01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].periodo").value(1))
                .andExpect(jsonPath("$[0].tipo").value("Control"));
    }

    // =========================================================
    // POST /api/academico
    // =========================================================

    @Test
    void POST_nota_creaNotaYRetorna201() throws Exception {
        when(service.guardarNota(any(Academico.class))).thenReturn(nota);

        mockMvc.perform(post("/api/academico")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nota)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.calificacion").value(6.5))
                .andExpect(jsonPath("$.alumnoId").value("alumno_01"));
    }

    @Test
    void POST_nota_notaReprobatoria_retorna201() throws Exception {
        Academico notaBaja = new Academico();
        notaBaja.setAlumnoId("alumno_02");
        notaBaja.setCalificacion(2.0);
        when(service.guardarNota(any(Academico.class))).thenReturn(notaBaja);

        mockMvc.perform(post("/api/academico")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(notaBaja)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.calificacion").value(2.0));
    }

    @Test
    void POST_nota_sinAlumnoId_retorna400() throws Exception {
        Academico notaSinId = new Academico();
        notaSinId.setCalificacion(6.0);

        mockMvc.perform(post("/api/academico")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(notaSinId)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void POST_nota_alumnoIdVacio_retorna400() throws Exception {
        Academico notaIdVacio = new Academico();
        notaIdVacio.setAlumnoId("   ");
        notaIdVacio.setCalificacion(6.0);

        mockMvc.perform(post("/api/academico")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(notaIdVacio)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void POST_nota_sinCalificacion_retorna400() throws Exception {
        Academico notaSinCalif = new Academico();
        notaSinCalif.setAlumnoId("alumno_01");

        mockMvc.perform(post("/api/academico")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(notaSinCalif)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void POST_nota_calificacionMenorAUno_retorna400() throws Exception {
        Academico notaInvalida = new Academico();
        notaInvalida.setAlumnoId("alumno_01");
        notaInvalida.setCalificacion(0.5);

        mockMvc.perform(post("/api/academico")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(notaInvalida)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void POST_nota_calificacionMayorASiete_retorna400() throws Exception {
        Academico notaInvalida = new Academico();
        notaInvalida.setAlumnoId("alumno_01");
        notaInvalida.setCalificacion(7.5);

        mockMvc.perform(post("/api/academico")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(notaInvalida)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void POST_nota_calificacionMinima_retorna201() throws Exception {
        Academico notaMin = new Academico();
        notaMin.setAlumnoId("alumno_01");
        notaMin.setCalificacion(1.0);
        when(service.guardarNota(any(Academico.class))).thenReturn(notaMin);

        mockMvc.perform(post("/api/academico")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(notaMin)))
                .andExpect(status().isCreated());
    }

    @Test
    void POST_nota_calificacionMaxima_retorna201() throws Exception {
        Academico notaMax = new Academico();
        notaMax.setAlumnoId("alumno_01");
        notaMax.setCalificacion(7.0);
        when(service.guardarNota(any(Academico.class))).thenReturn(notaMax);

        mockMvc.perform(post("/api/academico")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(notaMax)))
                .andExpect(status().isCreated());
    }
}
