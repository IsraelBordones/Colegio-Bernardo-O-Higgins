package cl.colegio.ohiggins.servicio_academico.service;

import cl.colegio.ohiggins.servicio_academico.model.Academico;
import cl.colegio.ohiggins.servicio_academico.repository.AcademicoRepository;
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
    void obtenerPorAlumno_retornaListaDeNotas() {
        when(repository.findByAlumnoId("alumno_bueno"))
                .thenReturn(Arrays.asList(notaEjemplo));

        List<Academico> resultado = service.obtenerPorAlumno("alumno_bueno");

        assertEquals(1, resultado.size());
        assertEquals("Matemáticas", resultado.get(0).getAsignatura());
        verify(repository, times(1)).findByAlumnoId("alumno_bueno");
    }

    @Test
    void obtenerPorAlumno_alumnoSinNotas_retornaListaVacia() {
        when(repository.findByAlumnoId("alumno_nuevo"))
                .thenReturn(Collections.emptyList());

        List<Academico> resultado = service.obtenerPorAlumno("alumno_nuevo");

        assertTrue(resultado.isEmpty());
        verify(repository, times(1)).findByAlumnoId("alumno_nuevo");
    }

    @Test
    void guardarNota_persisteYRetornaLaNota() {
        when(repository.save(notaEjemplo)).thenReturn(notaEjemplo);

        Academico resultado = service.guardarNota(notaEjemplo);

        assertNotNull(resultado);
        assertEquals(6.5, resultado.getCalificacion());
        assertEquals("alumno_bueno", resultado.getAlumnoId());
        verify(repository, times(1)).save(notaEjemplo);
    }

    @Test
    void guardarNota_conDatosCompletos_retornaTodosLosCampos() {
        Academico nuevaNota = new Academico();
        nuevaNota.setAlumnoId("alumno_medio");
        nuevaNota.setAsignatura("Lenguaje");
        nuevaNota.setCalificacion(5.2);
        nuevaNota.setPeriodo(2);
        nuevaNota.setTipo("Examen");

        Academico guardada = new Academico();
        guardada.setId(2L);
        guardada.setAlumnoId("alumno_medio");
        guardada.setAsignatura("Lenguaje");
        guardada.setCalificacion(5.2);
        guardada.setPeriodo(2);
        guardada.setTipo("Examen");

        when(repository.save(nuevaNota)).thenReturn(guardada);

        Academico resultado = service.guardarNota(nuevaNota);

        assertEquals(2L, resultado.getId());
        assertEquals("Lenguaje", resultado.getAsignatura());
        assertEquals(2, resultado.getPeriodo());
        assertEquals("Examen", resultado.getTipo());
    }

    @Test
    void obtenerPorAlumno_conVariasNotas_retornaTodasCorrectamente() {
        Academico nota2 = new Academico();
        nota2.setId(2L);
        nota2.setAlumnoId("alumno_bueno");
        nota2.setAsignatura("Lenguaje");
        nota2.setCalificacion(6.8);
        nota2.setPeriodo(1);
        nota2.setTipo("Control");

        when(repository.findByAlumnoId("alumno_bueno"))
                .thenReturn(Arrays.asList(notaEjemplo, nota2));

        List<Academico> resultado = service.obtenerPorAlumno("alumno_bueno");

        assertEquals(2, resultado.size());
        assertEquals("Matemáticas", resultado.get(0).getAsignatura());
        assertEquals("Lenguaje", resultado.get(1).getAsignatura());
    }
}
