package com.example.bff_colegio.dto; // <--- Cambiado a tu ruta real

import lombok.Data;

@Data
public class UsuarioDTO {
    private String id;
    private String nombre;
    private String rol;
}