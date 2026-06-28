package com.aura.api.repository;

import com.aura.api.model.Venda;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VendaRepository extends JpaRepository<Venda, Long> {
    List<Venda> findAllByOrderByDataVendaDesc();
}
