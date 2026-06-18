package cl.colegio.ohiggins.servicio_usuarios;

import cl.colegio.ohiggins.servicio_usuarios.config.SecurityConfig;
import cl.colegio.ohiggins.servicio_usuarios.controller.UsuarioController;
import cl.colegio.ohiggins.servicio_usuarios.model.Usuario;
import cl.colegio.ohiggins.servicio_usuarios.service.UsuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = UsuarioController.class)
@Import(SecurityConfig.class)
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsuarioService usuarioService;

    @Autowired
    private ObjectMapper objectMapper;

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

    // =========================================================
    // GET /api/usuarios
    // =========================================================

    @Test
    void GET_listar_retornaListaDeUsuarios() throws Exception {
        when(usuarioService.obtenerTodos()).thenReturn(Arrays.asList(alumno, profesor));

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].username").value("alumno_bueno"))
                .andExpect(jsonPath("$[1].username").value("profe1"));
    }

    @Test
    void GET_listar_sinUsuarios_retornaListaVacia() throws Exception {
        when(usuarioService.obtenerTodos()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void GET_listar_verificaRolYNombre() throws Exception {
        when(usuarioService.obtenerTodos()).thenReturn(Arrays.asList(alumno));

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].role").value("alumno"))
                .andExpect(jsonPath("$[0].nombre").value("Alumno Bueno"));
    }

    // =========================================================
    // GET /api/usuarios/alumnos?cursoId=
    // =========================================================

    @Test
    void GET_alumnosPorCurso_retornaAlumnosDelCurso() throws Exception {
        when(usuarioService.listarAlumnosPorCursoId(1)).thenReturn(Arrays.asList(alumno));

        mockMvc.perform(get("/api/usuarios/alumnos").param("cursoId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("alumno_bueno"))
                .andExpect(jsonPath("$[0].role").value("alumno"));
    }

    @Test
    void GET_alumnosPorCurso_sinAlumnos_retornaListaVacia() throws Exception {
        when(usuarioService.listarAlumnosPorCursoId(99)).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/usuarios/alumnos").param("cursoId", "99"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void GET_alumnosPorCurso_multipleAlumnos_retornaTodos() throws Exception {
        Usuario alumno2 = new Usuario();
        alumno2.setUsername("alumno_dos");
        alumno2.setRole("alumno");
        alumno2.setCursoId(1);
        when(usuarioService.listarAlumnosPorCursoId(1)).thenReturn(Arrays.asList(alumno, alumno2));

        mockMvc.perform(get("/api/usuarios/alumnos").param("cursoId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    // =========================================================
    // POST /api/usuarios/login
    // =========================================================

    @Test
    void POST_login_credencialesCorrectas_retorna200ConDatosUsuario() throws Exception {
        when(usuarioService.autenticar("alumno_bueno", "1234")).thenReturn(alumno);

        Map<String, String> loginData = Map.of("username", "alumno_bueno", "password", "1234");

        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("alumno_bueno"))
                .andExpect(jsonPath("$.role").value("alumno"))
                .andExpect(jsonPath("$.nombre").value("Alumno Bueno"));
    }

    @Test
    void POST_login_credencialesIncorrectas_retorna401() throws Exception {
        when(usuarioService.autenticar("alumno_bueno", "clave_mala")).thenReturn(null);

        Map<String, String> loginData = Map.of("username", "alumno_bueno", "password", "clave_mala");

        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginData)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void POST_login_usuarioInexistente_retorna401() throws Exception {
        when(usuarioService.autenticar("fantasma", "1234")).thenReturn(null);

        Map<String, String> loginData = Map.of("username", "fantasma", "password", "1234");

        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginData)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void POST_login_sinUsername_retorna401() throws Exception {
        Map<String, String> loginData = Map.of("password", "1234");

        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginData)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void POST_login_sinPassword_retorna401() throws Exception {
        Map<String, String> loginData = Map.of("username", "alumno_bueno");

        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginData)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void POST_login_loginProfesor_retornaRolProfesor() throws Exception {
        when(usuarioService.autenticar("profe1", "profesor123")).thenReturn(profesor);

        Map<String, String> loginData = Map.of("username", "profe1", "password", "profesor123");

        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("PROFESOR"));
    }

    // =========================================================
    // POST /api/usuarios
    // =========================================================

    @Test
    void POST_guardarUsuario_retornaUsuarioCreado() throws Exception {
        when(usuarioService.crearUsuario(any(Usuario.class))).thenReturn(alumno);

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(alumno)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("alumno_bueno"))
                .andExpect(jsonPath("$.nombre").value("Alumno Bueno"))
                .andExpect(jsonPath("$.role").value("alumno"));
    }

    @Test
    void POST_guardarProfesor_retornaProfesorCreado() throws Exception {
        when(usuarioService.crearUsuario(any(Usuario.class))).thenReturn(profesor);

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profesor)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("PROFESOR"))
                .andExpect(jsonPath("$.username").value("profe1"));
    }

    @Test
    void POST_guardarUsuario_verificaCursoId() throws Exception {
        when(usuarioService.crearUsuario(any(Usuario.class))).thenReturn(alumno);

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(alumno)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cursoId").value(1));
    }
}