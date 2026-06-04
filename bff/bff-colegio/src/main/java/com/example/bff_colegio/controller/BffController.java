package com.example.bff_colegio.controller;

import com.example.bff_colegio.dto.UsuarioDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/bff")
public class BffController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String username = loginData.get("username");
        String password = loginData.get("password");

        // Autenticación contra usuarios-ms (MySQL)
        try {
            // usuarios-ms devuelve: { username, nombre, role }
            Map<String, String> requestBody = Map.of(
                    "username", username,
                    "password", password
            );

            var userMap = WebClient.builder()
                    .baseUrl("http://usuarios-ms:8081")
                    .build()
                    .post()
                    .uri("/api/usuarios/login")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (userMap == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
            }

            UsuarioDTO user = new UsuarioDTO(
                    (String) userMap.get("username"),
                    (String) userMap.get("nombre"),
                    (String) userMap.get("role")
            );

            return ResponseEntity.ok(user);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
        }
    }
}

