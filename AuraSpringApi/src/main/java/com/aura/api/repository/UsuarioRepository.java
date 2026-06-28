package com.aura.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aura.api.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByUsuarioAndSenha(String usuario, String senha);
}