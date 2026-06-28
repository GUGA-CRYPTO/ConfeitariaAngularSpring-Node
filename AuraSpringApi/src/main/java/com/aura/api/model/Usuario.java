package com.aura.api.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    public String nome;
    public String email;
    public String usuario;
    
    
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    public String senha;
    
    @JsonProperty("tipo_usuario")
    public String tipoUsuario;
    
    @JsonProperty("data_cadastro")
    public LocalDateTime dataCadastro = LocalDateTime.now();
}