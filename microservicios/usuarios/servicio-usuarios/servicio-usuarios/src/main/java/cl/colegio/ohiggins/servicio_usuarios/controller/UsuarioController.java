package cl.colegio.ohiggins.usuarios.controller;

import cl.colegio.ohiggins.usuarios.model.Usuario;
import cl.colegio.ohiggins.usuarios.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // Cuando alguien haga un POST a /api/usuarios con un JSON de usuario
    @PostMapping
    public Usuario guardar(@RequestBody Usuario usuario) {
        return usuarioService.crearUsuario(usuario);
    }
}