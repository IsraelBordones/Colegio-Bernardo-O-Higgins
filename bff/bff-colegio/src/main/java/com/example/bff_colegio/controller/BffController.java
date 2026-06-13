package com.example.bff_colegio.controller;

import com.example.bff_colegio.dto.UsuarioDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Map;





@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS}, allowCredentials = "true")
@RestController
@RequestMapping("/api/bff")
public class BffController {

    public static class LoginRequest {
        public String username;
        public String password;
    }


    @Autowired
    private WebClient.Builder webClientBuilder;





    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginData) {
        String username = loginData.username;
        String password = loginData.password;



        // Autenticación contra usuarios-ms (MySQL)
        try {
            // usuarios-ms devuelve: { username, nombre, role }
            Map<String, String> requestBody = Map.of(
                    "username", username,
                    "password", password
            );

            // usar tipo parametrizado para que WebClient no falle al deserializar
            var userMap = webClientBuilder
                    .baseUrl("http://usuarios-ms:8081")
                    .build()
                    .post()
                    .uri("/api/usuarios/login")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(new org.springframework.core.ParameterizedTypeReference<Map<String, String>>() {})
                    .block();

            if (userMap == null || !userMap.containsKey("username")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
            }

            // usuarios-ms devuelve la propiedad "role", así que mapeamos role -> rol
            return ResponseEntity.ok(new UsuarioDTO(
                    userMap.get("username"),
                    userMap.get("nombre"),
                    userMap.get("role")
            ));

        } catch (Exception e) {
            // incluir detalle mínimo en consola para depurar
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales incorrectas");
        }
    }



    // ======================
    // Usuarios

    // ======================
    @GetMapping("/usuarios")
    public ResponseEntity<List<Map>> listarUsuarios() {
        try {
            List<Map> usuarios = webClientBuilder
                    .baseUrl("http://usuarios-ms:8081")
                    .build()
                    .get()
                    .uri("/api/usuarios")
                    .retrieve()
                    .bodyToMono(List.class)
                    .block();

            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of(Map.of("error", e.getClass().getSimpleName(), "message", String.valueOf(e.getMessage()))));
        }
    }

    @GetMapping("/usuarios/alumnos")
    public ResponseEntity<List<Map>> listarAlumnosPorCurso(@RequestParam int cursoId) {
        try {
            List<Map> alumnos = webClientBuilder
                    .baseUrl("http://usuarios-ms:8081")
                    .build()
                    .get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/api/usuarios/alumnos")
                            .queryParam("cursoId", cursoId)
                            .build())
                    .retrieve()
                    .bodyToMono(List.class)
                    .block();

            return ResponseEntity.ok(alumnos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }

    // ======================
    // Asistencia
    // ======================
    @PostMapping("/asistencia")
    public ResponseEntity<?> registrarAsistencia(@RequestBody Map<String, Object> asistencia) {
        try {
            var saved = webClientBuilder
                    .baseUrl("http://asistencia-ms:8083")
                    .build()
                    .post()
                    .uri("/api/asistencia")
                    .bodyValue(asistencia)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error registrando asistencia");
        }
    }

    @GetMapping("/asistencia/alumno/{alumnoId}")
    public ResponseEntity<List<Map>> historialAsistencia(@PathVariable String alumnoId) {
        try {
            List<Map> historial = webClientBuilder
                    .baseUrl("http://asistencia-ms:8083")
                    .build()
                    .get()
                    .uri("/api/asistencia/alumno/" + alumnoId)
                    .retrieve()
                    .bodyToMono(List.class)
                    .block();

            return ResponseEntity.ok(historial);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }

    // ======================
    // Academico (Notas)
    // ======================
    @PostMapping("/academico")
    public ResponseEntity<?> guardarNota(@RequestBody Map<String, Object> nota) {
        try {
            var saved = webClientBuilder
                    .baseUrl("http://academico-ms:8082")
                    .build()
                    .post()
                    .uri("/api/academico")
                    .bodyValue(nota)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error guardando nota");
        }
    }

    @GetMapping("/academico/alumno/{alumnoId}")
    public ResponseEntity<List<Map>> listarNotas(@PathVariable String alumnoId) {
        try {
            List<Map> notas = webClientBuilder
                    .baseUrl("http://academico-ms:8082")
                    .build()
                    .get()
                    .uri("/api/academico/alumno/" + alumnoId)
                    .retrieve()
                    .bodyToMono(List.class)
                    .block();

            return ResponseEntity.ok(notas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(List.of());
        }
    }

}


