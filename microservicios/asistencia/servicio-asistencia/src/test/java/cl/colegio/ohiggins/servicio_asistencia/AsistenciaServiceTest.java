package cl.colegio.ohiggins.servicio_asistencia.service;

import cl.colegio.ohiggins.servicio_asistencia.model.Asistencia;
import cl.colegio.ohiggins.servicio_asistencia.repository.AsistenciaRepository;
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
    void historialAlumno_retornaRegistrosDeAsistencia() {
        when(repository.findByAlumnoId("alumno_bueno"))
                .thenReturn(Arrays.asList(asistenciaEjemplo));

        List<Asistencia> resultado = service.historialAlumno("alumno_bueno");

        assertEquals(1, resultado.size());
        assertTrue(resultado.get(0).isPresente());
        assertEquals("Matemáticas", resultado.get(0).getAsignatura());
        verify(repository, times(1)).findByAlumnoId("alumno_bueno");
    }

    @Test
    void historialAlumno_sinRegistros_retornaListaVacia() {
        when(repository.findByAlumnoId("alumno_nuevo"))
                .thenReturn(Collections.emptyList());

        List<Asistencia> resultado = service.historialAlumno("alumno_nuevo");

        assertTrue(resultado.isEmpty());
        verify(repository, times(1)).findByAlumnoId("alumno_nuevo");
    }

    @Test
    void registrarAsistencia_presente_seGuardaCorrectamente() {
        when(repository.save(asistenciaEjemplo)).thenReturn(asistenciaEjemplo);

        Asistencia resultado = service.registrarAsistencia(asistenciaEjemplo);

        assertNotNull(resultado);
        assertTrue(resultado.isPresente());
        assertEquals("alumno_bueno", resultado.getAlumnoId());
        verify(repository, times(1)).save(asistenciaEjemplo);
    }

    @Test
    void registrarAsistencia_ausente_seGuardaCorrectamente() {
        Asistencia ausencia = new Asistencia();
        ausencia.setId(2L);
        ausencia.setAlumnoId("alumno_malo");
        ausencia.setFecha("2026-06-02");
        ausencia.setPresente(false);
        ausencia.setAsignatura("Lenguaje");
        ausencia.setObservaciones("Sin justificación");

        when(repository.save(ausencia)).thenReturn(ausencia);

        Asistencia resultado = service.registrarAsistencia(ausencia);

        assertFalse(resultado.isPresente());
        assertEquals("alumno_malo", resultado.getAlumnoId());
        assertEquals("Sin justificación", resultado.getObservaciones());
    }

    @Test
    void historialAlumno_conVariosRegistros_retornaTodosCorrectamente() {
        Asistencia asistencia2 = new Asistencia();
        asistencia2.setId(2L);
        asistencia2.setAlumnoId("alumno_bueno");
        asistencia2.setFecha("2026-06-02");
        asistencia2.setPresente(false);
        asistencia2.setAsignatura("Lenguaje");

        when(repository.findByAlumnoId("alumno_bueno"))
                .thenReturn(Arrays.asList(asistenciaEjemplo, asistencia2));

        List<Asistencia> resultado = service.historialAlumno("alumno_bueno");

        assertEquals(2, resultado.size());
        assertTrue(resultado.get(0).isPresente());
        assertFalse(resultado.get(1).isPresente());
        assertEquals("Lenguaje", resultado.get(1).getAsignatura());
    }
}
