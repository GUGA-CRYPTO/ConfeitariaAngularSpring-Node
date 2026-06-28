package com.aura.api.model;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "produtos")
public class Produto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    public String nome;
    public String descricao;
    public String categoria;
    public BigDecimal preco;
    public Integer estoque;
    public String ingredientes;
    public String status;
    public String imagem;
}