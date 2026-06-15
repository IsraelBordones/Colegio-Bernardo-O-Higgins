package cl.colegio.ohiggins.servicio_usuarios;

import cl.colegio.ohiggins.servicio_usuarios.model.Usuario;
import cl.colegio.ohiggins.servicio_usuarios.repository.UsuarioRepository;
import cl.colegio.ohiggins.servicio_usuarios.service.UsuarioService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
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

    @BeforeEach
    void setUp() {
        alumno = new Usuario("alumno_bueno", "1234", "Juan Pérez", "alumno", 1);
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

    @Test
    void crearUsuario_guardaYRetornaUsuario() {
        when(usuarioRepository.save(alumno)).thenReturn(alumno);

        Usuario resultado = service.crearUsuario(alumno);

        assertNotNull(resultado);
        assertEquals("alumno_bueno", resultado.getUsername());
        verify(usuarioRepository, times(1)).save(alumno);
    }

    @Test
    void obtenerTodos_retornaListaDeUsuarios() {
        when(usuarioRepository.findAll()).thenReturn(Arrays.asList(alumno));

        List<Usuario> resultado = service.obtenerTodos();

        assertFalse(resultado.isEmpty());
        assertEquals(1, resultado.size());
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
    void buscarPorId_existente_retornaUsuario() {
        when(usuarioRepository.findById(1L)).thenReturn(Optional.of(alumno));

        Usuario resultado = service.buscarPorId(1L);

        assertNotNull(resultado);
    }

    @Test
    void buscarPorId_inexistente_retornaNull() {
        when(usuarioRepository.findById(99L)).thenReturn(Optional.empty());

        Usuario resultado = service.buscarPorId(99L);

        assertNull(resultado);
    }
}