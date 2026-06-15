package cl.colegio.ohiggins.servicio_usuarios.service;

import cl.colegio.ohiggins.servicio_usuarios.model.Usuario;
import cl.colegio.ohiggins.servicio_usuarios.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioService service;

    private Usuario alumno;
    private Usuario profesor;

    @BeforeEach
    void setUp() {
        alumno = new Usuario();
        alumno.setId(1L);
        alumno.setUsername("alumno_bueno");
        alumno.setPassword("1234");
        alumno.setNombre("Alumno Bueno");
        alumno.setRole("alumno");
        alumno.setCursoId(1);

        profesor = new Usuario();
        profesor.setId(2L);
        profesor.setUsername("profe1");
        profesor.setPassword("profesor123");
        profesor.setNombre("Andres Gonzalez");
        profesor.setRole("PROFESOR");
        profesor.setCursoId(1);
    }

    @Test
    void obtenerTodos_retornaListaDeUsuarios() {
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(alumno, profesor));

        List<Usuario> resultado = service.obtenerTodos();

        assertEquals(2, resultado.size());
        verify(usuarioRepository, times(1)).findAll();
    }

    @Test
    void obtenerTodos_sinUsuarios_retornaListaVacia() {
        when(usuarioRepository.findAll()).thenReturn(Collections.emptyList());

        List<Usuario> resultado = service.obtenerTodos();

        assertTrue(resultado.isEmpty());
    }

    @Test
    void crearUsuario_retornaUsuarioGuardado() {
        when(usuarioRepository.save(alumno)).thenReturn(alumno);

        Usuario resultado = service.crearUsuario(alumno);

        assertNotNull(resultado);
        assertEquals("alumno_bueno", resultado.getUsername());
        verify(usuarioRepository, times(1)).save(alumno);
    }

    @Test
    void buscarPorId_idExistente_retornaUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));

        Usuario resultado = service.buscarPorId(1L);

        assertNotNull(resultado);
        assertEquals("alumno_bueno", resultado.getUsername());
    }

    @Test
    void buscarPorId_idInexistente_retornaNull() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        Usuario resultado = service.buscarPorId(99L);

        assertNull(resultado);
    }

    @Test
    void listarAlumnosPorCursoId_retornaAlumnosDelCurso() {
        when(usuarioRepository.findByRoleAndCursoId("alumno", 1))
                .thenReturn(Arrays.asList(alumno));

        List<Usuario> resultado = service.listarAlumnosPorCursoId(1);

        assertEquals(1, resultado.size());
        assertEquals("alumno_bueno", resultado.get(0).getUsername());
    }

    @Test
    void autenticar_credencialesCorrectas_retornaUsuario() {
        when(usuarioRepository.findByUsername("alumno_bueno"))
                .thenReturn(Optional.of(alumno));

        Usuario resultado = service.autenticar("alumno_bueno", "1234");

        assertNotNull(resultado);
        assertEquals("alumno_bueno", resultado.getUsername());
    }

    @Test
    void autenticar_passwordIncorrecta_retornaNull() {
        when(usuarioRepository.findByUsername("alumno_bueno"))
                .thenReturn(Optional.of(alumno));

        Usuario resultado = service.autenticar("alumno_bueno", "clave_mala");

        assertNull(resultado);
    }

    @Test
    void autenticar_usuarioInexistente_retornaNull() {
        when(usuarioRepository.findByUsername("fantasma"))
                .thenReturn(Optional.empty());

        Usuario resultado = service.autenticar("fantasma", "1234");

        assertNull(resultado);
    }

    @Test
    void autenticar_usernameNull_retornaNull() {
        Usuario resultado = service.autenticar(null, "1234");
        assertNull(resultado);
    }

    @Test
    void autenticar_passwordNull_retornaNull() {
        Usuario resultado = service.autenticar("alumno_bueno", null);
        assertNull(resultado);
    }
}
