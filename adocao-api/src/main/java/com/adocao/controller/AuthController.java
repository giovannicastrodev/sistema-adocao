package com.adocao.controller;

import com.adocao.dto.auth.*;
import com.adocao.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticacao", description = "Cadastro e login de adotantes e ONGs")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/cadastro")
    @Operation(summary = "Cria uma conta de adotante e retorna o token JWT")
    public ResponseEntity<LoginResponse> cadastrarUsuario(@Valid @RequestBody CadastroUsuarioRequest request) {
        LoginResponse response = authService.cadastrarUsuario(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/ong")
    @Operation(summary = "Cria uma conta de ONG e retorna o token JWT")
    public ResponseEntity<LoginResponse> cadastrarOng(@Valid @RequestBody CadastroOngRequest request) {
        LoginResponse response = authService.cadastrarOng(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Login unificado para adotante ou ONG")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
