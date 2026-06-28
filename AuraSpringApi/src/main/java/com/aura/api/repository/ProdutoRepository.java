package com.aura.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aura.api.model.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}