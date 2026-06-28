package com.aura.api.dto;

import com.aura.api.model.Usuario;

public class LoginResponse {
    public String token;
    public Usuario usuario;
    public LoginResponse(String token, Usuario usuario) {
        this.token = token;
        this.usuario = usuario;
    }
}
