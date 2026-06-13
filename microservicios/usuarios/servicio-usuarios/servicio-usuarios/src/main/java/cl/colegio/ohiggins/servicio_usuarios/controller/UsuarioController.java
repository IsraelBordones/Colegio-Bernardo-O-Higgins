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
    @PostMapping(value = "/login")
    public ResponseEntity<?> login(@RequestBody Map<String, Object> loginData) {
        try {
            String username = loginData == null || loginData.get("username") == null ? null : String.valueOf(loginData.get("username"));
            String password = loginData == null || loginData.get("password") == null ? null : String.valueOf(loginData.get("password"));

            if (username == null || password == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
            }

            Usuario user = usuarioService.autenticar(username, password);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
            }

            return ResponseEntity.ok(Map.of(
                    "username", user.getUsername(),
                    "nombre", user.getNombre(),
                    "role", user.getRole()
            ));
        } catch (Exception e) {
            // Evita que el servidor muera por errores de deserialización/parseo
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
        }
    }



    // Cuando alguien haga un POST a /api/usuarios con un JSON de usuario
    @PostMapping
    public Usuario guardar(@RequestBody Usuario usuario) {
        return usuarioService.crearUsuario(usuario);
    }
}

