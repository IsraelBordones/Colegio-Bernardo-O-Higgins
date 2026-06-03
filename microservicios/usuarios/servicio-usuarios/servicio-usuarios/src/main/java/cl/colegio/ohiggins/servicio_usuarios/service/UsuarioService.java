package cl.colegio.ohiggins.servicio_usuarios.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cl.colegio.ohiggins.servicio_usuarios.model.Usuario;
import cl.colegio.ohiggins.servicio_usuarios.repository.UsuarioRepository;

import java.util.List;

@Service
public class UsuarioService {

    // @Autowired conecta este servicio con el repositorio que creamos antes
    @Autowired
    private UsuarioRepository usuarioRepository;

    // Método para obtener todos los usuarios (para el admin)
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    // Método para guardar un nuevo usuario (estudiante, profe, etc.)
    public Usuario crearUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // Método para buscar un usuario específico por su ID
    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    // Listar alumnos de un curso
    public List<Usuario> listarAlumnosPorCursoId(int cursoId) {
        return usuarioRepository.findByRoleAndCursoId("alumno", cursoId);
    }

    // Autenticación simple para login del BFF
    public Usuario autenticar(String username, String password) {
        if (username == null || password == null) return null;

        return usuarioRepository.findByUsername(username)
                .filter(u -> password.equals(u.getPassword()))
                .orElse(null);
    }
}


