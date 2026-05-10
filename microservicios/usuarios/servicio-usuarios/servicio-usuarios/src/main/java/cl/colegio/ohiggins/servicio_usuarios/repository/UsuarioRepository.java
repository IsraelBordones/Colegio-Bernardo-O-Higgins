package cl.colegio.ohiggins.servicio_usuarios.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    // Esto permite buscar por nombre de usuario en la BDD
    Optional<Usuario> findByUsername(String username);

    List<Usuario> findByRoleAndCursoId(String role, Integer cursoId);
}
