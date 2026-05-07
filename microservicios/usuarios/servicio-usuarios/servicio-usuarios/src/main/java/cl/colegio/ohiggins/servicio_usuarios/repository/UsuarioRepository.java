package cl.colegio.ohiggins.usuarios.repository;

import cl.colegio.ohiggins.usuarios.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    // Al extender MongoRepository, ya tienes métodos como:
    // .save(), .findAll(), .delete(), .findById()
}