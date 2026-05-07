package cl.colegio.ohiggins.usuarios.service;

import cl.colegio.ohiggins.usuarios.model.Usuario;
import cl.colegio.ohiggins.usuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
        // Aquí podrías poner lógica: ej. "if (usuario.getRut() == null) ..."
        return usuarioRepository.save(usuario);
    }

    // Método para buscar un usuario específico por su ID de Mongo
    public Usuario buscarPorId(String id) {
        return usuarioRepository.findById(id).orElse(null);
    }
}