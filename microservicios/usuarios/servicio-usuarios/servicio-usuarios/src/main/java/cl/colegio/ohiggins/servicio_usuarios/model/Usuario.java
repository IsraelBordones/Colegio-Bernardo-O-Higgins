package cl.colegio.ohiggins.usuarios.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data // Esto ahorra escribir Getters y Setters
@Document(collection = "usuarios") // Nombre de la colección en MongoDB
public class Usuario {
    @Id
    private String id;        // ID único generado por MongoDB
    private String rut;       // Identificador chileno
    private String nombre;
    private String rol;       // "DOCENTE", "APODERADO", "ADMIN" [cite: 85, 102]
    private String email;
    private boolean activo;
}