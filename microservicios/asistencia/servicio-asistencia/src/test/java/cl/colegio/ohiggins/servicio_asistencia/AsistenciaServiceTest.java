package cl.colegio.ohiggins.servicio_asistencia;

import cl.colegio.ohiggins.servicio_asistencia.model.Asistencia;
import cl.colegio.ohiggins.servicio_asistencia.repository.AsistenciaRepository;
import cl.colegio.ohiggins.servicio_asistencia.service.AsistenciaService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AsistenciaServiceTest {

    @Mock
    private AsistenciaRepository repository;

    @InjectMocks
    private AsistenciaService service;

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
    void historialAlumno_retornaRegistros() {
        when(repository.findByAlumnoId("alumno_01")).thenReturn(Arrays.asList(asistencia));

        List<Asistencia> resultado = service.historialAlumno("alumno_01");

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("alumno_01", resultado.get(0).getAlumnoId());
    }

    @Test
    void registrarAsistencia_presente_seGuardaCorrectamente() {
        when(repository.save(asistencia)).thenReturn(asistencia);

        Asistencia resultado = service.registrarAsistencia(asistencia);

        assertNotNull(resultado);
        assertTrue(resultado.isPresente());
        verify(repository, times(1)).save(asistencia);
    }

    @Test
    void registrarAsistencia_ausente_seGuardaCorrectamente() {
        asistencia.setPresente(false);
        when(repository.save(asistencia)).thenReturn(asistencia);

        Asistencia resultado = service.registrarAsistencia(asistencia);

        assertNotNull(resultado);
        assertFalse(resultado.isPresente());
    }

    @Test
    void historialAlumno_listaVacia_retornaVacio() {
        when(repository.findByAlumnoId("alumno_99")).thenReturn(Collections.emptyList());

        List<Asistencia> resultado = service.historialAlumno("alumno_99");

        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
    }

    @Test
    void historialAlumno_multipleRegistros_retornaTodos() {
        Asistencia a2 = new Asistencia();
        a2.setAlumnoId("alumno_01");
        a2.setFecha("2024-06-02");
        a2.setPresente(false);
        when(repository.findByAlumnoId("alumno_01")).thenReturn(Arrays.asList(asistencia, a2));

        List<Asistencia> resultado = service.historialAlumno("alumno_01");

        assertEquals(2, resultado.size());
    }
}