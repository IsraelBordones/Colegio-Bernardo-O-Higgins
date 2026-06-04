package cl.colegio.ohiggins.servicio_usuarios.controller;

import cl.colegio.ohiggins.servicio_usuarios.model.Usuario;
import cl.colegio.ohiggins.servicio_usuarios.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController // Indica que esto es una API que devuelve JSON
@RequestMapping("/api/usuarios") // Todas las rutas empezarán con esto
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // Cuando alguien haga un GET a /api/usuarios
    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.obtenerTodos();
    }

    // Listar alumnos por curso
    @GetMapping("/alumnos")
    public List<Usuario> listarAlumnosPorCurso(@RequestParam int cursoId) {
        return usuarioService.listarAlumnosPorCursoId(cursoId);
    }

    // Login: POST /api/usuarios/login { username, password }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        Usuario user = usuarioService.autenticar(username, password);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
        }

        // No devolver password
        return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "nombre", user.getNombre(),
                "role", user.getRole()
        ));
    }

    // Cuando alguien haga un POST a /api/usuarios con un JSON de usuario
    @PostMapping
    public Usuario guardar(@RequestBody Usuario usuario) {
        return usuarioService.crearUsuario(usuario);
    }
}

