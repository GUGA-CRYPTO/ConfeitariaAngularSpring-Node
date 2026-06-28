package com.aura.api.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.aura.api.model.Usuario;
import com.aura.api.repository.UsuarioRepository;
import com.aura.api.service.AuthService;

@RestController
public class AuthController {
    private final UsuarioRepository usuarioRepo;
    private final AuthService authService;
    
    public AuthController(UsuarioRepository usuarioRepo, AuthService authService) {
        this.usuarioRepo = usuarioRepo;
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciais) {
        String senhaMd5 = authService.md5(credenciais.get("senha"));
        Usuario user = usuarioRepo.findByUsuarioAndSenha(credenciais.get("usuario"), senhaMd5);
        
        if (user == null) return ResponseEntity.status(401).body(Map.of("erro", "Credenciais inválidas."));
        
        String token = authService.gerarToken(user);
        return ResponseEntity.ok(Map.of("token", token, "usuario", user));
    }
}