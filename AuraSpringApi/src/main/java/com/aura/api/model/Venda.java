package com.aura.api.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "vendas")
public class Venda {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    
    @JsonProperty("usuario_id")
    public Long usuarioId;
    
    @JsonProperty("cliente_nome")
    public String clienteNome;
    
    @JsonProperty("forma_pagamento")
    public String formaPagamento;
    
    @Column(length = 1000)
    public String observacao;
    public BigDecimal desconto = BigDecimal.ZERO;
    public BigDecimal subtotal = BigDecimal.ZERO;
    
    @JsonProperty("valor_total")
    public BigDecimal valorTotal = BigDecimal.ZERO;
    
    @JsonProperty("data_venda")
    public LocalDateTime dataVenda = LocalDateTime.now();
    
    public String status;

    @OneToMany(mappedBy = "venda", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    public List<VendaItem> itens = new ArrayList<>();
}
