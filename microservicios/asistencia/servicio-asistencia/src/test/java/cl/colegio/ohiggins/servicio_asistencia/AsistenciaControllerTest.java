package cl.colegio.ohiggins.servicio_asistencia;

import cl.colegio.ohiggins.servicio_asistencia.controller.AsistenciaController;
import cl.colegio.ohiggins.servicio_asistencia.model.Asistencia;
import cl.colegio.ohiggins.servicio_asistencia.service.AsistenciaService;

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

@WebMvcTest(AsistenciaController.class)
class AsistenciaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AsistenciaService service;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private Asistencia asistencia;

    @BeforeEach
    void setUp() {
        asistencia = new Asistencia();
        asistencia.setAlumnoId("alumno_01");
        asistencia.setFecha("2024-06-01");
        asistencia.setPresente(true);
        asistencia.setEstado("PRESENTE");
        asistencia.setAsignatura("Matemáticas");
    }

    // =========================================================
    // GET /api/asistencia/alumno/{alumnoId}
    // =========================================================

    @Test
    void GET_historialPorAlumno_retornaLista() throws Exception {
        when(service.historialAlumno("alumno_01")).thenReturn(Arrays.asList(asistencia));

        mockMvc.perform(get("/api/asistencia/alumno/alumno_01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].alumnoId").value("alumno_01"))
                .andExpect(jsonPath("$[0].presente").value(true))
                .andExpect(jsonPath("$[0].estado").value("PRESENTE"));
    }

    @Test
    void GET_historialPorAlumno_listaVacia_retornaArregloVacio() throws Exception {
        when(service.historialAlumno("alumno_99")).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/asistencia/alumno/alumno_99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void GET_historialPorAlumno_multipleRegistros_retornaTodos() throws Exception {
        Asistencia a2 = new Asistencia();
        a2.setAlumnoId("alumno_01");
        a2.setFecha("2024-06-02");
        a2.setPresente(false);
        a2.setEstado("AUSENTE");
        when(service.historialAlumno("alumno_01")).thenReturn(Arrays.asList(asistencia, a2));

        mockMvc.perform(get("/api/asistencia/alumno/alumno_01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[1].estado").value("AUSENTE"));
    }

    @Test
    void GET_historialPorAlumno_verificaFechaYAsignatura() throws Exception {
        when(service.historialAlumno("alumno_01")).thenReturn(Arrays.asList(asistencia));

        mockMvc.perform(get("/api/asistencia/alumno/alumno_01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].fecha").value("2024-06-01"))
                .andExpect(jsonPath("$[0].asignatura").value("Matemáticas"));
    }

    // =========================================================
    // POST /api/asistencia
    // =========================================================

    @Test
    void POST_asistencia_presente_retorna201() throws Exception {
        when(service.registrarAsistencia(any(Asistencia.class))).thenReturn(asistencia);

        mockMvc.perform(post("/api/asistencia")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(asistencia)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.presente").value(true))
                .andExpect(jsonPath("$.alumnoId").value("alumno_01"));
    }

    @Test
    void POST_asistencia_ausente_retorna201() throws Exception {
        Asistencia ausente = new Asistencia();
        ausente.setAlumnoId("alumno_01");
        ausente.setFecha("2024-06-02");
        ausente.setPresente(false);
        ausente.setEstado("AUSENTE");
        when(service.registrarAsistencia(any(Asistencia.class))).thenReturn(ausente);

        mockMvc.perform(post("/api/asistencia")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ausente)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.presente").value(false))
                .andExpect(jsonPath("$.estado").value("AUSENTE"));
    }

    @Test
    void POST_asistencia_justificado_retorna201() throws Exception {
        Asistencia justificado = new Asistencia();
        justificado.setAlumnoId("alumno_01");
        justificado.setFecha("2024-06-03");
        justificado.setPresente(false);
        justificado.setEstado("JUSTIFICADO");
        justificado.setObservaciones("Certificado médico");
        when(service.registrarAsistencia(any(Asistencia.class))).thenReturn(justificado);

        mockMvc.perform(post("/api/asistencia")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(justificado)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.estado").value("JUSTIFICADO"));
    }

    @Test
    void POST_asistencia_sinAlumnoId_retorna400() throws Exception {
        Asistencia sinId = new Asistencia();
        sinId.setFecha("2024-06-01");
        sinId.setPresente(true);

        mockMvc.perform(post("/api/asistencia")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sinId)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void POST_asistencia_alumnoIdVacio_retorna400() throws Exception {
        Asistencia idVacio = new Asistencia();
        idVacio.setAlumnoId("");
        idVacio.setFecha("2024-06-01");
        idVacio.setPresente(true);

        mockMvc.perform(post("/api/asistencia")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(idVacio)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void POST_asistencia_sinFecha_retorna400() throws Exception {
        Asistencia sinFecha = new Asistencia();
        sinFecha.setAlumnoId("alumno_01");
        sinFecha.setPresente(true);

        mockMvc.perform(post("/api/asistencia")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sinFecha)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void POST_asistencia_sinEstado_seAsignaAutomaticamente_retorna201() throws Exception {
        // Cuando no hay estado explícito, el controller lo deriva de presente=true → PRESENTE
        Asistencia sinEstado = new Asistencia();
        sinEstado.setAlumnoId("alumno_01");
        sinEstado.setFecha("2024-06-01");
        sinEstado.setPresente(true);
        // estado queda null → el controller asignará "PRESENTE"

        Asistencia respuesta = new Asistencia();
        respuesta.setAlumnoId("alumno_01");
        respuesta.setFecha("2024-06-01");
        respuesta.setPresente(true);
        respuesta.setEstado("PRESENTE");
        when(service.registrarAsistencia(any(Asistencia.class))).thenReturn(respuesta);

        mockMvc.perform(post("/api/asistencia")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sinEstado)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.estado").value("PRESENTE"));
    }
}
