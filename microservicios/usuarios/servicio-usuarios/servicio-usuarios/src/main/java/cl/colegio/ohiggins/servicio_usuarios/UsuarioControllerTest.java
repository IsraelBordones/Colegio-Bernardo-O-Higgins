package cl.colegio.ohiggins.servicio_usuarios;

import cl.colegio.ohiggins.servicio_usuarios.controller.UsuarioController;
import cl.colegio.ohiggins.servicio_usuarios.model.Usuario;
import cl.colegio.ohiggins.servicio_usuarios.service.UsuarioService;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import cl.colegio.ohiggins.servicio_usuarios.config.SecurityConfig;

@WebMvcTest(UsuarioController.class)
@Import(SecurityConfig.class)
class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UsuarioService usuarioService;

    @Autowired
    private ObjectMapper objectMapper;

    private Usuario alumno;

    @BeforeEach
    void setUp() {
        alumno = new Usuario("alumno_bueno", "1234", "Juan Pérez", "alumno", 1);
    }

    @Test
    void getListarUsuarios_retornaLista() throws Exception {
        when(usuarioService.obtenerTodos()).thenReturn(Arrays.asList(alumno));

        mockMvc.perform(get("/api/usuarios"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("alumno_bueno"));
    }

    @Test
    void postLogin_credencialesCorrectas_retorna200() throws Exception {
        when(usuarioService.autenticar("alumno_bueno", "1234")).thenReturn(alumno);

        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                Map.of("username", "alumno_bueno", "password", "1234"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("alumno_bueno"))
                .andExpect(jsonPath("$.role").value("alumno"));
    }

    @Test
    void postLogin_credencialesIncorrectas_retorna401() throws Exception {
        when(usuarioService.autenticar(anyString(), anyString())).thenReturn(null);

        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                Map.of("username", "alumno_bueno", "password", "mala"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void postCrearUsuario_retornaUsuarioCreado() throws Exception {
        when(usuarioService.crearUsuario(any(Usuario.class))).thenReturn(alumno);

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(alumno)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("alumno_bueno"));
    }

    @Test
    void postLogin_sinBody_retorna401() throws Exception {
        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getAlumnosPorCurso_retornaLista() throws Exception {
        when(usuarioService.listarAlumnosPorCursoId(1)).thenReturn(Arrays.asList(alumno));

        mockMvc.perform(get("/api/usuarios/alumnos").param("cursoId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].username").value("alumno_bueno"));
    }

    @Test
    void postLogin_usernameNull_retorna401() throws Exception {
        when(usuarioService.autenticar(any(), any())).thenReturn(null);

        mockMvc.perform(post("/api/usuarios/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"password\": \"1234\"}"))
                .andExpect(status().isUnauthorized());
    }
}