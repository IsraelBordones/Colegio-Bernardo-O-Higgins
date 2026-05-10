package com.example.bff_colegio.dto;

public class UsuarioDTO {
    private String username;
    private String nombre;
    private String rol;

    // Constructor vacío
    public UsuarioDTO() {
    }

    // Constructor con datos
    public UsuarioDTO(String username, String nombre, String rol) {
        this.username = username;
        this.nombre = nombre;
        this.rol = rol;
    }

    // Getters y Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
}