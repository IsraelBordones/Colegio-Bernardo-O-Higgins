package cl.colegio.ohiggins.servicio_asistencia.controller;

import cl.colegio.ohiggins.servicio_asistencia.model.Asistencia;
import cl.colegio.ohiggins.servicio_asistencia.service.AsistenciaService;
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

@WebMvcTest(AsistenciaController.class)
class AsistenciaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AsistenciaService service;

    @Autowired
    private ObjectMapper objectMapper;

    private Asistencia asistenciaEjemplo;

    @BeforeEach
    void setUp() {
        asistenciaEjemplo = new Asistencia();
        asistenciaEjemplo.setId(1L);
        asistenciaEjemplo.setAlumnoId("alumno_bueno");
        asistenciaEjemplo.setFecha("2026-06-01");
        asistenciaEjemplo.setPresente(true);
        asistenciaEjemplo.setAsignatura("Matemáticas");
        asistenciaEjemplo.setObservaciones("");
    }

    @Test
    void GET_historial_retornaListaDeAsistencias() throws Exception {
        when(service.historialAlumno("alumno_bueno"))
                .thenReturn(Arrays.asList(asistenciaEjemplo));

        mockMvc.perform(get("/api/asistencia/alumno/alumno_bueno"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].alumnoId").value("alumno_bueno"))
                .andExpect(jsonPath("$[0].asignatura").value("Matemáticas"))
                .andExpect(jsonPath("$[0].presente").value(true));
    }

    @Test
    void GET_historial_sinRegistros_retornaListaVacia() throws Exception {
        when(service.historialAlumno("alumno_nuevo"))
                .thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/asistencia/alumno/alumno_nuevo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void POST_registrarAsistencia_presente_retornaRegistroGuardado() throws Exception {
        when(service.registrarAsistencia(any(Asistencia.class)))
                .thenReturn(asistenciaEjemplo);

        mockMvc.perform(post("/api/asistencia")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(asistenciaEjemplo)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.presente").value(true))
                .andExpect(jsonPath("$.asignatura").value("Matemáticas"));
    }

    @Test
    void POST_registrarAsistencia_ausente_retornaRegistroGuardado() throws Exception {
        Asistencia ausencia = new Asistencia();
        ausencia.setId(2L);
        ausencia.setAlumnoId("alumno_malo");
        ausencia.setFecha("2026-06-02");
        ausencia.setPresente(false);
        ausencia.setAsignatura("Historia");
        ausencia.setObservaciones("Faltó sin aviso");

        when(service.registrarAsistencia(any(Asistencia.class))).thenReturn(ausencia);

        mockMvc.perform(post("/api/asistencia")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ausencia)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.presente").value(false))
                .andExpect(jsonPath("$.alumnoId").value("alumno_malo"))
                .andExpect(jsonPath("$.observaciones").value("Faltó sin aviso"));
    }

    @Test
    void GET_historial_conVariosRegistros_retornaTodos() throws Exception {
        Asistencia asistencia2 = new Asistencia();
        asistencia2.setId(2L);
        asistencia2.setAlumnoId("alumno_bueno");
        asistencia2.setFecha("2026-06-02");
        asistencia2.setPresente(false);
        asistencia2.setAsignatura("Lenguaje");

        when(service.historialAlumno("alumno_bueno"))
                .thenReturn(Arrays.asList(asistenciaEjemplo, asistencia2));

        mockMvc.perform(get("/api/asistencia/alumno/alumno_bueno"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[1].presente").value(false))
                .andExpect(jsonPath("$[1].asignatura").value("Lenguaje"));
    }
}
