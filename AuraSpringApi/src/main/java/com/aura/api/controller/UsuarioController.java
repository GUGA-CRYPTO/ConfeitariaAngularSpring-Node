package com.aura.api.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aura.api.model.Usuario;
import com.aura.api.repository.UsuarioRepository;
import com.aura.api.service.AuthService;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {
    private final UsuarioRepository repo;
    private final AuthService authService;

    public UsuarioController(UsuarioRepository repo, AuthService authService) {
        this.repo = repo;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Usuario usuario) {
        usuario.senha = authService.md5(usuario.senha); // Hash MD5 para bater com DB Node antigo
        Usuario salvo = repo.save(usuario);
        return ResponseEntity.ok(Map.of("id", salvo.id, "mensagem", "Usuário criado!"));
    }

    @GetMapping
    public ResponseEntity<?> listar() { return ResponseEntity.ok(repo.findAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<?> porId(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Usuario dados) {
        return repo.findById(id).map(u -> {
            u.nome = dados.nome; u.email = dados.email; u.usuario = dados.usuario; u.tipoUsuario = dados.tipoUsuario;
            if(dados.senha != null && !dados.senha.isBlank()) u.senha = authService.md5(dados.senha);
            repo.save(u);
            return ResponseEntity.ok(Map.of("mensagem", "Usuário atualizado!"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.ok(Map.of("mensagem", "Usuário deletado!"));
    }
}