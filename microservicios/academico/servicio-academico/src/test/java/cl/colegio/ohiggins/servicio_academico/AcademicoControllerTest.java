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
    }

    @Test
    void getNotasPorAlumno_retornaLista() throws Exception {
        when(service.obtenerPorAlumno("alumno_01")).thenReturn(Arrays.asList(nota));

        mockMvc.perform(get("/api/academico/alumno/alumno_01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].alumnoId").value("alumno_01"))
                .andExpect(jsonPath("$[0].asignatura").value("Matemáticas"));
    }

    @Test
    void postNota_creaNotaYRetorna() throws Exception {
        when(service.guardarNota(any(Academico.class))).thenReturn(nota);

        mockMvc.perform(post("/api/academico")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(nota)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.calificacion").value(6.5));
    }

    @Test
    void getNotasPorAlumno_listaVacia_retornaArregloVacio() throws Exception {
        when(service.obtenerPorAlumno("alumno_99")).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/academico/alumno/alumno_99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void postNota_notaReprobatoria_retornaNotaGuardada() throws Exception {
        Academico notaBaja = new Academico();
        notaBaja.setAlumnoId("alumno_02");
        notaBaja.setCalificacion(2.0);
        when(service.guardarNota(any(Academico.class))).thenReturn(notaBaja);

        mockMvc.perform(post("/api/academico")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(notaBaja)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.calificacion").value(2.0));
    }

    @Test
    void getNotasPorAlumno_multipleNotas_retornaTodasLasNotas() throws Exception {
        Academico nota2 = new Academico();
        nota2.setAlumnoId("alumno_01");
        nota2.setAsignatura("Historia");
        nota2.setCalificacion(5.5);
        when(service.obtenerPorAlumno("alumno_01")).thenReturn(Arrays.asList(nota, nota2));

        mockMvc.perform(get("/api/academico/alumno/alumno_01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }
}