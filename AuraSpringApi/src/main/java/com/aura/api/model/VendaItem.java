package com.aura.api.model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "venda_itens")
public class VendaItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venda_id")
    public Venda venda;

    @JsonProperty("produto_id")
    public Long produtoId;
    
    public Integer quantidade;
    
    @JsonProperty("preco_unitario")
    public BigDecimal precoUnitario;
    
    @JsonProperty("subtotal_item")
    public BigDecimal subtotalItem;
    
    public String nome;
}
