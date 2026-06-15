package cl.colegio.ohiggins.servicio_academico;

import cl.colegio.ohiggins.servicio_academico.model.Academico;
import cl.colegio.ohiggins.servicio_academico.repository.AcademicoRepository;
import cl.colegio.ohiggins.servicio_academico.service.AcademicoService;

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
class AcademicoServiceTest {

    @Mock
    private AcademicoRepository repository;

    @InjectMocks
    private AcademicoService service;

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
    void obtenerPorAlumno_retornaListaConNotas() {
        when(repository.findByAlumnoId("alumno_01")).thenReturn(Arrays.asList(nota));

        List<Academico> resultado = service.obtenerPorAlumno("alumno_01");

        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("alumno_01", resultado.get(0).getAlumnoId());
    }

    @Test
    void obtenerPorAlumno_listaVacia_retornaVacio() {
        when(repository.findByAlumnoId("alumno_99")).thenReturn(Collections.emptyList());

        List<Academico> resultado = service.obtenerPorAlumno("alumno_99");

        assertNotNull(resultado);
        assertTrue(resultado.isEmpty());
    }

    @Test
    void guardarNota_retornaNotaGuardada() {
        when(repository.save(nota)).thenReturn(nota);

        Academico resultado = service.guardarNota(nota);

        assertNotNull(resultado);
        assertEquals("Matemáticas", resultado.getAsignatura());
        verify(repository, times(1)).save(nota);
    }

    @Test
    void obtenerPorAlumno_multipleNotas_retornaTodasLasNotas() {
        Academico nota2 = new Academico();
        nota2.setAlumnoId("alumno_01");
        nota2.setAsignatura("Historia");
        nota2.setCalificacion(5.0);

        when(repository.findByAlumnoId("alumno_01")).thenReturn(Arrays.asList(nota, nota2));

        List<Academico> resultado = service.obtenerPorAlumno("alumno_01");

        assertEquals(2, resultado.size());
    }

    @Test
    void guardarNota_notaReprobatoria_seGuardaCorrectamente() {
        Academico notaBaja = new Academico();
        notaBaja.setAlumnoId("alumno_02");
        notaBaja.setCalificacion(2.5);
        when(repository.save(notaBaja)).thenReturn(notaBaja);

        Academico resultado = service.guardarNota(notaBaja);

        assertNotNull(resultado);
        assertTrue(resultado.getCalificacion() < 4.0);
    }
}