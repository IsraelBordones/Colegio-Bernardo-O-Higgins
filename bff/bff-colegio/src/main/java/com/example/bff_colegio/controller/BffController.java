package com.example.bff_colegio.controller; // <--- Cambiado a tu ruta real

import com.example.bff_colegio.dto.UsuarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/colegio")
public class BffController {

    @Autowired
    private WebClient.Builder webClientBuilder;

    @GetMapping("/usuarios")
    public Flux<UsuarioDTO> obtenerTodosLosUsuarios() {
        return webClientBuilder.build()
                .get()
                .uri("http://localhost:8081/api/usuarios")
                .retrieve()
                .bodyToFlux(UsuarioDTO.class);
    }
}