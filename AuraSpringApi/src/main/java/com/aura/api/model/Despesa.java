package com.aura.api.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "despesas")
public class Despesa {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    @JsonProperty("usuario_id")
    public Long usuarioId;
    
    public String descricao;
    public String categoria;
    public BigDecimal valor;
    
    @JsonProperty("data_despesa")
    public LocalDate dataDespesa;
    
    public String status;
    
    @JsonProperty("data_registro")
    public LocalDateTime dataRegistro = LocalDateTime.now();
}