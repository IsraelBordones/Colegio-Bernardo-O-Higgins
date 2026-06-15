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
        asistencia.setAsignatura("Matemáticas");
    }

    @Test
    void getHistorialPorAlumno_retornaLista() throws Exception {
        when(service.historialAlumno("alumno_01")).thenReturn(Arrays.asList(asistencia));

        mockMvc.perform(get("/api/asistencia/alumno/alumno_01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].alumnoId").value("alumno_01"))
                .andExpect(jsonPath("$[0].presente").value(true));
    }

    @Test
    void postAsistencia_presente_retornaRegistro() throws Exception {
        when(service.registrarAsistencia(any(Asistencia.class))).thenReturn(asistencia);

        mockMvc.perform(post("/api/asistencia")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(asistencia)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.presente").value(true));
    }

    @Test
    void postAsistencia_ausente_retornaRegistro() throws Exception {
        asistencia.setPresente(false);
        when(service.registrarAsistencia(any(Asistencia.class))).thenReturn(asistencia);

        mockMvc.perform(post("/api/asistencia")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(asistencia)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.presente").value(false));
    }

    @Test
    void getHistorialPorAlumno_listaVacia_retornaArregloVacio() throws Exception {
        when(service.historialAlumno("alumno_99")).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/asistencia/alumno/alumno_99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void getHistorialPorAlumno_multipleRegistros_retornaTodos() throws Exception {
        Asistencia a2 = new Asistencia();
        a2.setAlumnoId("alumno_01");
        a2.setFecha("2024-06-02");
        a2.setPresente(false);
        when(service.historialAlumno("alumno_01")).thenReturn(Arrays.asList(asistencia, a2));

        mockMvc.perform(get("/api/asistencia/alumno/alumno_01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }
}