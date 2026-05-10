package com.example.bff_colegio.controller;

import com.example.bff_colegio.dto.UsuarioDTO;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/bff")
public class BffController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        // Simulación de base de datos
        if ("william".equals(username) && "1234".equals(password)) {
            UsuarioDTO user = new UsuarioDTO("william", "William Cáceres", "profesor");
            return ResponseEntity.ok(user);
        } 
        else if ("israel".equals(username) && "1234".equals(password)) {
            UsuarioDTO user = new UsuarioDTO("israel", "Israel Alumno", "alumno");
            return ResponseEntity.ok(user);
        } 
        else {
            // Si falla, devuelve un mensaje de error claro
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
        }
    }
}