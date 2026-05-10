package cl.colegio.ohiggins.servicio_usuarios.model;

public class User {
    private String username;
    private String password;
    private String nombre;
    private String role;

    public User() {}

    public User(String username, String password, String nombre, String role) {
        this.username = username;
        this.password = password;
        this.nombre = nombre;
        this.role = role;
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
}