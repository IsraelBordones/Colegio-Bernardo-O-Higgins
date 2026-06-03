package cl.colegio.ohiggins.servicio_usuarios.repository;

import cl.colegio.ohiggins.servicio_usuarios.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsername(String username);

    List<Usuario> findByRoleAndCursoId(String role, Integer cursoId);
}

