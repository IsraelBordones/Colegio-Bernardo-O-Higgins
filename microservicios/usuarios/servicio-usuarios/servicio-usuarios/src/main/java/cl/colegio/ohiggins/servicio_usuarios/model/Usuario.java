package cl.colegio.ohiggins.servicio_usuarios.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "usuarios") // Esto crea la "tabla" en Mongo
public class Usuario {
    @Id
    private String id; // Mongo necesita un ID único tipo String
    private String username;
    private String password;
    private String nombre;
    private String role;
    private Integer cursoId; // Curso asignado (demo/profesor-alumno)

    public Usuario() {}

public Usuario(String username, String password, String nombre, String role, Integer cursoId) {
        this.username = username;
        this.password = password;
        this.nombre = nombre;
        this.role = role;
        this.cursoId = cursoId;
    }

    // Getters y Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Integer getCursoId() { return cursoId; }
    public void setCursoId(Integer cursoId) { this.cursoId = cursoId; }
}

